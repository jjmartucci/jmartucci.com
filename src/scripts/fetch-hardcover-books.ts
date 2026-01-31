import fs from 'fs/promises';
import path from 'path';
import { HardcoverClient } from './hardcover-api';
import { generateBookMarkdown } from '../utils/markdown-writer';
import type { BookMetadata } from './types/hardcover';

const BOOKS_DIR = path.join(process.cwd(), 'src/content/books');
const IMAGES_DIR = path.join(process.cwd(), 'src/content/books/images');
const RATE_LIMIT_DELAY = 1000; // 1 second between operations

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const apiToken = process.env.HARDCOVER_API;

  if (!apiToken) {
    throw new Error(
      'HARDCOVER_API environment variable is not set. Please add it to your .env file.'
    );
  }

  console.log('🔗 Connecting to Hardcover API...');
  const client = new HardcoverClient(apiToken);

  console.log('📚 Fetching completed books...');
  const response = await client.fetchCompletedBooks();

  // Add error handling for API response
  if (!response.data) {
    console.error('Full API Response:', JSON.stringify(response, null, 2));
    throw new Error('Invalid API response structure - no data property');
  }

  if (!response.data.me || !Array.isArray(response.data.me) || response.data.me.length === 0) {
    console.error('Full API Response:', JSON.stringify(response, null, 2));
    throw new Error('Invalid API response structure - me is not an array or is empty');
  }

  const books = response.data.me[0].user_books;

  if (!books) {
    console.error('Full API Response:', JSON.stringify(response, null, 2));
    throw new Error('No books data in API response');
  }

  console.log(`✅ Found ${books.length} completed books\n`);

  let newBooks = 0;
  let skippedBooks = 0;
  let failedBooks = 0;

  for (const [index, userBook] of books.entries()) {
    const book = userBook.book;

    try {
      // Extract year from date_added
      const dateRead = new Date(userBook.date_added);
      const year = dateRead.getFullYear().toString();

      // Generate filename from slug
      const filename = `${book.slug}.md`;
      const yearDir = path.join(BOOKS_DIR, year);
      const filePath = path.join(yearDir, filename);

      // Check if file already exists (incremental update)
      try {
        await fs.access(filePath);
        skippedBooks++;
        console.log(`⏭️  Skipping existing: ${year}/${filename}`);
        continue;
      } catch {
        // File doesn't exist, proceed to create it
      }

      // Ensure year directory exists
      await fs.mkdir(yearDir, { recursive: true });

      // Extract author from cached_contributors
      const author = book.cached_contributors?.[0]?.author?.name;

      // Download cover image if available
      let imagePath: string | undefined;
      if (book.image?.url) {
        try {
          // Determine image extension from URL
          const urlPath = new URL(book.image.url).pathname;
          const ext = path.extname(urlPath) || '.jpg';
          const imageFilename = `${book.slug}${ext}`;
          const imageYearDir = path.join(IMAGES_DIR, year);
          const imageFullPath = path.join(imageYearDir, imageFilename);

          // Ensure image directory exists
          await fs.mkdir(imageYearDir, { recursive: true });

          // Download image
          await client.downloadImage(book.image.url, imageFullPath);
          imagePath = `../images/${year}/${imageFilename}`;
          console.log(`  📸 Downloaded cover image`);
        } catch (error) {
          console.warn(
            `  ⚠️  Failed to download image for "${book.title}": ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
          // Continue without image
        }
      }

      // Extract genre from cached_tags - only Fiction, Nonfiction, or comic
      const ALLOWED_GENRES = ['Fiction', 'Nonfiction', 'comic'];
      const genre = book.cached_tags
        ? Object.values(book.cached_tags)
            .flat()
            .map((t) => t.tag)
            .filter((tag) => {
              if (!tag || typeof tag !== 'string' || tag.trim().length === 0) return false;
              // Case-insensitive match against allowed genres
              return ALLOWED_GENRES.some(allowed =>
                tag.toLowerCase() === allowed.toLowerCase()
              );
            })
        : undefined;

      // Create metadata object
      const metadata: BookMetadata = {
        title: book.title,
        author,
        link: `https://hardcover.app/books/${book.slug}`,
        image: imagePath,
        genre,
        rating: userBook.rating ?? undefined,
        dateRead: dateRead.toISOString().split('T')[0], // Format as YYYY-MM-DD
        reviewedAt: userBook.reviewed_at
          ? new Date(userBook.reviewed_at).toISOString().split('T')[0]
          : undefined,
        draft: false,
      };

      // Use review_raw for markdown body, or review as fallback
      const reviewContent = userBook.review_raw || userBook.review || '';

      // Generate markdown
      const markdown = generateBookMarkdown(metadata, reviewContent);

      // Write file
      await fs.writeFile(filePath, markdown, 'utf-8');

      newBooks++;
      console.log(`✅ Created: ${year}/${filename}`);

      // Respect rate limit (wait between books)
      if (index < books.length - 1) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (error) {
      failedBooks++;
      console.error(
        `❌ Failed to process "${book.title}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      // Continue with next book
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ ${newBooks} new books created`);
  console.log(`   ⏭️  ${skippedBooks} existing books skipped`);
  if (failedBooks > 0) {
    console.log(`   ❌ ${failedBooks} books failed`);
  }
  console.log('='.repeat(50));
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
