import fs from 'fs/promises';
import path from 'path';
import { generateBookMarkdown } from '../utils/markdown-writer';
import type { TootMetadata } from './types/mastodon';

const TOOTS_DIR = path.join(process.cwd(), 'src/content/toots');
const IMAGES_DIR = path.join(process.cwd(), 'src/content/toots/images');
const RSS_URL = 'https://front-end.social/@threetonesun.rss';

function generateSlug(date: Date, id: string): string {
  const dateStr = date.toISOString().split('T')[0];
  return `${dateStr}-${id}`;
}

function decodeHTMLEntities(text: string): string {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&amp;/g, '&');
}

function convertLinksToMarkdown(html: string): string {
  // Decode HTML entities first
  let decoded = decodeHTMLEntities(html);

  // Convert <a href="...">text</a> to [text](url)
  decoded = decoded.replace(/<a[^>]*href="([^"]*)"[^>]*>([\s\S]*?)<\/a>/g, (match, url, text) => {
    // Strip any HTML tags from the link text
    const cleanText = text.replace(/<[^>]*>/g, '').trim();
    return `[${cleanText}](${url})`;
  });

  // Remove other HTML tags but keep the content
  decoded = decoded.replace(/<br\s*\/?>/g, '\n');
  decoded = decoded.replace(/<p>/g, '').replace(/<\/p>/g, '\n\n');
  decoded = decoded.replace(/<[^>]*>/g, '');

  return decoded.trim();
}

function parseRSSFeed(xml: string): Array<{
  id: string;
  content: string;
  url: string;
  publishedDate: string;
  author?: string;
  inReplyTo?: string;
  mediaUrl?: string;
  mediaDescription?: string;
}> {
  const items: Array<any> = [];

  // Extract all <item> elements (RSS 2.0 format)
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xml)) !== null) {
    const itemXml = match[1];

    // Extract fields
    const guidMatch = /<guid[^>]*>(.*?)<\/guid>/.exec(itemXml);
    const linkMatch = /<link>(.*?)<\/link>/.exec(itemXml);
    const pubDateMatch = /<pubDate>(.*?)<\/pubDate>/.exec(itemXml);
    const descriptionMatch = /<description>([\s\S]*?)<\/description>/.exec(itemXml);
    const inReplyToMatch = /<thr:in-reply-to[^>]*ref="([^"]*)"/.exec(itemXml);

    // Extract media attachment
    const mediaMatch = /<media:content[^>]*url="([^"]*)"[^>]*>([\s\S]*?)<\/media:content>/.exec(itemXml);
    let mediaUrl: string | undefined;
    let mediaDescription: string | undefined;

    if (mediaMatch) {
      mediaUrl = mediaMatch[1];
      const mediaContentXml = mediaMatch[2];
      const mediaDescMatch = /<media:description[^>]*>(.*?)<\/media:description>/.exec(mediaContentXml);
      if (mediaDescMatch) {
        mediaDescription = decodeHTMLEntities(mediaDescMatch[1]);
      }
    }

    if (guidMatch && linkMatch && pubDateMatch && descriptionMatch) {
      // Extract just the status ID from the URL
      const url = guidMatch[1];
      const statusId = url.split('/').pop() || url;

      // Convert HTML content to markdown with proper links
      const markdownContent = convertLinksToMarkdown(descriptionMatch[1]);

      items.push({
        id: statusId,
        content: markdownContent,
        url: linkMatch[1],
        publishedDate: pubDateMatch[1],
        inReplyTo: inReplyToMatch ? inReplyToMatch[1] : undefined,
        mediaUrl,
        mediaDescription,
      });
    }
  }

  return items;
}

async function main() {
  const rssUrl = process.env.MASTODON_RSS_URL || RSS_URL;

  console.log('🐘 Fetching Mastodon RSS feed...');

  try {
    const response = await fetch(rssUrl);

    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const toots = parseRSSFeed(xml);

    console.log(`✅ Found ${toots.length} toots in feed\n`);

    let newToots = 0;
    let skippedToots = 0;

    for (const toot of toots) {
      try {
        const publishedDate = new Date(toot.publishedDate);
        const year = publishedDate.getFullYear().toString();

        // Generate filename from date and ID
        const slug = generateSlug(publishedDate, toot.id);
        const filename = `${slug}.md`;
        const yearDir = path.join(TOOTS_DIR, year);
        const filePath = path.join(yearDir, filename);

        // Check if file already exists (incremental update)
        try {
          await fs.access(filePath);
          skippedToots++;
          continue;
        } catch {
          // File doesn't exist, proceed to create it
        }

        // Ensure year directory exists
        await fs.mkdir(yearDir, { recursive: true });

        // Download media if available (images only, skip videos)
        let imagePath: string | undefined;
        if (toot.mediaUrl) {
          try {
            const urlPath = new URL(toot.mediaUrl).pathname;
            const ext = path.extname(urlPath) || '.jpg';

            // Only download image files, skip videos
            const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp'];
            if (imageExtensions.includes(ext.toLowerCase())) {
              const imageFilename = `${toot.id}${ext}`;
              const imageYearDir = path.join(IMAGES_DIR, year);
              const imageFullPath = path.join(imageYearDir, imageFilename);

              // Ensure image directory exists
              await fs.mkdir(imageYearDir, { recursive: true });

              // Download image
              const response = await fetch(toot.mediaUrl);
              if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                const buffer = Buffer.from(arrayBuffer);
                await fs.writeFile(imageFullPath, buffer);
                imagePath = `../images/${year}/${imageFilename}`;
                console.log(`  📸 Downloaded image`);
              }
            } else {
              console.log(`  ⏭️  Skipping non-image media (${ext})`);
            }
          } catch (error) {
            console.warn(
              `  ⚠️  Failed to download media for toot ${toot.id}: ${
                error instanceof Error ? error.message : 'Unknown error'
              }`
            );
          }
        }

        // Create metadata object
        const metadata: TootMetadata = {
          tootId: toot.id,
          url: toot.url,
          publishedDate: publishedDate.toISOString().split('T')[0],
          draft: false,
          inReplyTo: toot.inReplyTo,
          image: imagePath,
          mediaDescription: toot.mediaDescription,
        };

        // Convert markdown links to HTML for rendering
        const htmlContent = toot.content.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>');

        // Generate markdown with toot content as body
        const markdown = generateBookMarkdown(metadata, htmlContent);

        // Write file
        await fs.writeFile(filePath, markdown, 'utf-8');

        newToots++;
        console.log(`✅ Created: ${year}/${filename}`);
      } catch (error) {
        console.error(
          `❌ Failed to process toot ${toot.id}: ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
      }
    }

    console.log('\n' + '='.repeat(50));
    console.log('📊 Summary:');
    console.log(`   ✅ ${newToots} new toots created`);
    console.log(`   ⏭️  ${skippedToots} toots skipped`);
    console.log('='.repeat(50));
  } catch (error) {
    console.error('\n❌ Fatal error:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  }
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
