import fs from 'fs/promises';
import path from 'path';
import { LastfmClient } from './lastfm-api';
import { generateBookMarkdown } from '../utils/markdown-writer';
import type { TrackMetadata } from './types/lastfm';

const MUSIC_DIR = path.join(process.cwd(), 'src/content/music');
const IMAGES_DIR = path.join(process.cwd(), 'src/content/music/images');

function generateSlug(artist: string, track: string): string {
  return `${artist}-${track}`
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function main() {
  const apiKey = process.env.LASTFM_API_KEY;
  const username = process.env.LASTFM_USERNAME;

  if (!apiKey) {
    throw new Error(
      'LASTFM_API_KEY environment variable is not set. Please add it to your .env file.'
    );
  }

  if (!username) {
    throw new Error(
      'LASTFM_USERNAME environment variable is not set. Please add it to your .env file.'
    );
  }

  console.log('🎵 Connecting to Last.fm API...');
  const client = new LastfmClient(apiKey, username);

  console.log('📻 Fetching loved tracks...');
  const tracks = await client.getAllLovedTracks();

  console.log(`✅ Found ${tracks.length} loved tracks\n`);

  let newTracks = 0;
  let skippedTracks = 0;
  let failedTracks = 0;

  for (const [index, track] of tracks.entries()) {
    try {
      // Extract year from loved date (Unix timestamp)
      const lovedDate = new Date(parseInt(track.date.uts) * 1000);
      const year = lovedDate.getFullYear().toString();

      // Generate filename from artist + track name
      const slug = generateSlug(track.artist.name, track.name);
      const filename = `${slug}.md`;
      const yearDir = path.join(MUSIC_DIR, year);
      const filePath = path.join(yearDir, filename);

      // Check if file already exists (incremental update)
      try {
        await fs.access(filePath);
        skippedTracks++;
        console.log(`⏭️  Skipping existing: ${year}/${filename}`);
        continue;
      } catch {
        // File doesn't exist, proceed to create it
      }

      // Ensure year directory exists
      await fs.mkdir(yearDir, { recursive: true });

      // Fetch detailed track info for better album artwork
      let imagePath: string | undefined;
      try {
        // Rate limiting: add delay before track.getInfo call
        await sleep(200);

        const trackInfo = await client.getTrackInfo(track.artist.name, track.name, track.mbid);

        if (trackInfo?.track?.album?.image && trackInfo.track.album.image.length > 0) {
          // Get the largest available album image
          const largestImage = trackInfo.track.album.image.find((img: any) => img.size === 'extralarge') ||
                              trackInfo.track.album.image.find((img: any) => img.size === 'large') ||
                              trackInfo.track.album.image.find((img: any) => img.size === 'medium') ||
                              trackInfo.track.album.image[0];

          if (largestImage && largestImage['#text'] && largestImage['#text'].trim().length > 0) {
            // Determine image extension from URL
            const urlPath = new URL(largestImage['#text']).pathname;
            const ext = path.extname(urlPath) || '.jpg';
            const imageFilename = `${slug}${ext}`;
            const imageYearDir = path.join(IMAGES_DIR, year);
            const imageFullPath = path.join(imageYearDir, imageFilename);

            // Ensure image directory exists
            await fs.mkdir(imageYearDir, { recursive: true });

            // Download image
            await client.downloadImage(largestImage['#text'], imageFullPath);
            imagePath = `../images/${year}/${imageFilename}`;
            console.log(`  📸 Downloaded album artwork`);
          }
        } else {
          console.log(`  ℹ️  No album artwork available`);
        }
      } catch (error) {
        console.warn(
          `  ⚠️  Failed to fetch/download artwork for "${track.name}": ${
            error instanceof Error ? error.message : 'Unknown error'
          }`
        );
        // Continue without image
      }

      // Create metadata object
      const metadata: TrackMetadata = {
        title: track.name,
        artist: track.artist.name,
        link: track.url,
        image: imagePath,
        lovedDate: lovedDate.toISOString().split('T')[0], // Format as YYYY-MM-DD
        mbid: track.mbid || undefined,
        draft: false,
      };

      // Generate markdown (no body content for music tracks)
      const markdown = generateBookMarkdown(metadata, '');

      // Write file
      await fs.writeFile(filePath, markdown, 'utf-8');

      newTracks++;
      console.log(`✅ Created: ${year}/${filename}`);
    } catch (error) {
      failedTracks++;
      console.error(
        `❌ Failed to process "${track.name}" by ${track.artist.name}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      // Continue with next track
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ ${newTracks} new tracks created`);
  console.log(`   ⏭️  ${skippedTracks} existing tracks skipped`);
  if (failedTracks > 0) {
    console.log(`   ❌ ${failedTracks} tracks failed`);
  }
  console.log('='.repeat(50));
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
