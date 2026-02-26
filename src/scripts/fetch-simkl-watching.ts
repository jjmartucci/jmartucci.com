import fs from 'fs/promises';
import path from 'path';
import { SimklClient } from './simkl-api';
import { generateBookMarkdown } from '../utils/markdown-writer';
import type { WatchingMetadata } from './types/simkl';

const WATCHING_DIR = path.join(process.cwd(), 'src/content/watching');
const IMAGES_DIR = path.join(process.cwd(), 'src/content/watching/images');
const RATE_LIMIT_DELAY = 1500; // 1.5 seconds between operations

function generateSlug(title: string, year: number): string {
  return `${title}-${year}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const clientId = process.env.SIMKL_ID;
  const accessToken = process.env.SIMKL_ACCESS_TOKEN;

  if (!clientId) {
    throw new Error(
      'SIMKL_ID environment variable is not set. Please add it to your .env file.'
    );
  }

  if (!accessToken) {
    throw new Error(
      'SIMKL_ACCESS_TOKEN environment variable is not set.\n' +
      'Run "npm run simkl:auth" to get your access token.'
    );
  }

  console.log('📺 Connecting to SIMKL API...');
  const client = new SimklClient(clientId, accessToken);

  console.log('🎬 Fetching watched shows and movies...');

  const [shows, movies] = await Promise.all([
    client.fetchWatchedShows(),
    client.fetchWatchedMovies()
  ]);

  const totalItems = shows.length + movies.length;
  console.log(`✅ Found ${shows.length} shows and ${movies.length} movies (${totalItems} total)\n`);

  let newItems = 0;
  let skippedItems = 0;
  let failedItems = 0;

  // Process shows
  for (const [index, item] of shows.entries()) {
    const show = item.show;

    try {
      // Skip if no last_watched_at date
      if (!item.last_watched_at) {
        console.log(`⏭️  Skipping "${show.title}": no last_watched_at date`);
        skippedItems++;
        continue;
      }

      // Fetch full details for the show
      console.log(`📺 Fetching details for "${show.title}"...`);
      const details = await client.fetchShowDetails(show.ids.simkl);

      // Extract year from last watched date
      const lastWatchedDate = new Date(item.last_watched_at);

      // Validate date
      if (isNaN(lastWatchedDate.getTime())) {
        console.log(`⏭️  Skipping "${show.title}": invalid last_watched_at date`);
        skippedItems++;
        continue;
      }

      const year = lastWatchedDate.getFullYear().toString();

      // Generate filename from slug
      const slug = generateSlug(show.title, show.year);
      const filename = `${slug}.md`;
      const yearDir = path.join(WATCHING_DIR, year);
      const filePath = path.join(yearDir, filename);

      // Check if file already exists (incremental update)
      try {
        await fs.access(filePath);
        skippedItems++;
        console.log(`⏭️  Skipping existing: ${year}/${filename}`);
        continue;
      } catch {
        // File doesn't exist, proceed to create it
      }

      // Ensure year directory exists
      await fs.mkdir(yearDir, { recursive: true });

      // Download poster image if available
      let imagePath: string | undefined;
      if (details.poster) {
        try {
          const ext = '.jpg';
          const imageFilename = `${slug}${ext}`;
          const imageYearDir = path.join(IMAGES_DIR, year);
          const imageFullPath = path.join(imageYearDir, imageFilename);

          // Ensure image directory exists
          await fs.mkdir(imageYearDir, { recursive: true });

          // Download image
          await client.downloadImage(details.poster, imageFullPath);
          imagePath = `../images/${year}/${imageFilename}`;
          console.log(`  📸 Downloaded poster image`);
        } catch (error) {
          console.warn(
            `  ⚠️  Failed to download image for "${show.title}": ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
          // Continue without image
        }
      }

      // Create metadata object
      const metadata: WatchingMetadata = {
        title: show.title,
        year: show.year,
        type: 'tv',
        link: `https://simkl.com/tv/${show.ids.simkl}`,
        image: imagePath,
        tags: details.genres,
        rating: item.user_rating ?? undefined,
        lastWatchedDate: lastWatchedDate.toISOString().split('T')[0],
        status: item.status,
        draft: false,
        overview: details.overview,
      };

      // Use review from SIMKL if available, otherwise empty for user's review
      const bodyContent = item.review || '';
      const markdown = generateBookMarkdown(metadata, bodyContent);

      // Write file
      await fs.writeFile(filePath, markdown, 'utf-8');

      newItems++;
      console.log(`✅ Created: ${year}/${filename}`);

      // Respect rate limit
      if (index < shows.length - 1 || movies.length > 0) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (error) {
      failedItems++;
      console.error(
        `❌ Failed to process "${show.title}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      // Continue with next item
    }
  }

  // Process movies
  for (const [index, item] of movies.entries()) {
    const movie = item.movie;

    try {
      // Skip if no last_watched_at date
      if (!item.last_watched_at) {
        console.log(`⏭️  Skipping "${movie.title}": no last_watched_at date`);
        skippedItems++;
        continue;
      }

      // Fetch full details for the movie
      console.log(`🎬 Fetching details for "${movie.title}"...`);
      const details = await client.fetchMovieDetails(movie.ids.simkl);

      // Extract year from last watched date
      const lastWatchedDate = new Date(item.last_watched_at);

      // Validate date
      if (isNaN(lastWatchedDate.getTime())) {
        console.log(`⏭️  Skipping "${movie.title}": invalid last_watched_at date`);
        skippedItems++;
        continue;
      }

      const year = lastWatchedDate.getFullYear().toString();

      // Generate filename from slug
      const slug = generateSlug(movie.title, movie.year);
      const filename = `${slug}.md`;
      const yearDir = path.join(WATCHING_DIR, year);
      const filePath = path.join(yearDir, filename);

      // Check if file already exists (incremental update)
      try {
        await fs.access(filePath);
        skippedItems++;
        console.log(`⏭️  Skipping existing: ${year}/${filename}`);
        continue;
      } catch {
        // File doesn't exist, proceed to create it
      }

      // Ensure year directory exists
      await fs.mkdir(yearDir, { recursive: true });

      // Download poster image if available
      let imagePath: string | undefined;
      if (details.poster) {
        try {
          const ext = '.jpg';
          const imageFilename = `${slug}${ext}`;
          const imageYearDir = path.join(IMAGES_DIR, year);
          const imageFullPath = path.join(imageYearDir, imageFilename);

          // Ensure image directory exists
          await fs.mkdir(imageYearDir, { recursive: true });

          // Download image
          await client.downloadImage(details.poster, imageFullPath);
          imagePath = `../images/${year}/${imageFilename}`;
          console.log(`  📸 Downloaded poster image`);
        } catch (error) {
          console.warn(
            `  ⚠️  Failed to download image for "${movie.title}": ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
          // Continue without image
        }
      }

      // Create metadata object
      const metadata: WatchingMetadata = {
        title: movie.title,
        year: movie.year,
        type: 'movie',
        link: `https://simkl.com/movies/${movie.ids.simkl}`,
        image: imagePath,
        tags: details.genres,
        rating: item.user_rating ?? undefined,
        lastWatchedDate: lastWatchedDate.toISOString().split('T')[0],
        draft: false,
        overview: details.overview,
      };

      // Use review from SIMKL if available, otherwise empty for user's review
      const bodyContent = item.review || '';
      const markdown = generateBookMarkdown(metadata, bodyContent);

      // Write file
      await fs.writeFile(filePath, markdown, 'utf-8');

      newItems++;
      console.log(`✅ Created: ${year}/${filename}`);

      // Respect rate limit
      if (index < movies.length - 1) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (error) {
      failedItems++;
      console.error(
        `❌ Failed to process "${movie.title}": ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      // Continue with next item
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ ${newItems} new items created`);
  console.log(`   ⏭️  ${skippedItems} existing items skipped`);
  if (failedItems > 0) {
    console.log(`   ❌ ${failedItems} items failed`);
  }
  console.log('='.repeat(50));
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
