import fs from 'fs/promises';
import path from 'path';
import { IGDBClient } from './igdb-api';
import { generateBookMarkdown } from '../utils/markdown-writer';
import type { BacklogExportGame, GameMetadata } from './types/igdb';

const GAMES_DIR = path.join(process.cwd(), 'src/content/games');
const IMAGES_DIR = path.join(process.cwd(), 'src/content/games/images');
const RATE_LIMIT_DELAY = 300; // 300ms between requests (IGDB allows 4 requests per second)

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

async function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function parseCSV(csvContent: string): Record<string, string>[] {
  const lines = csvContent.split('\n').filter(line => line.trim());
  if (lines.length === 0) return [];

  // Parse a CSV line respecting quoted fields
  function parseLine(line: string): string[] {
    const result: string[] = [];
    let current = '';
    let inQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      const nextChar = line[i + 1];

      if (char === '"') {
        if (inQuotes && nextChar === '"') {
          // Escaped quote
          current += '"';
          i++; // Skip next quote
        } else {
          // Toggle quote state
          inQuotes = !inQuotes;
        }
      } else if (char === ',' && !inQuotes) {
        // Field separator
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  }

  // Parse header
  const headers = parseLine(lines[0]);

  // Parse rows
  const rows: Record<string, string>[] = [];
  for (let i = 1; i < lines.length; i++) {
    const values = parseLine(lines[i]);
    const row: Record<string, string> = {};
    headers.forEach((header, index) => {
      row[header] = values[index] || '';
    });
    rows.push(row);
  }

  return rows;
}

function extractIGDBId(igdbField: string): number | null {
  if (!igdbField || igdbField.trim() === '') return null;

  const trimmed = igdbField.trim();

  // Try to extract ID from URL pattern: https://www.igdb.com/games/{slug}--{id}
  const urlMatch = trimmed.match(/--(\d+)$/);
  if (urlMatch) {
    return parseInt(urlMatch[1], 10);
  }

  // Try direct number
  const directNumber = parseInt(trimmed, 10);
  if (!isNaN(directNumber)) {
    return directNumber;
  }

  return null;
}

async function main() {
  const clientId = process.env.IGDB_CLIENT_ID;
  const clientSecret = process.env.IGDB_CLIENT_SECRET;
  const exportFilePath = process.argv[2];

  if (!clientId) {
    throw new Error(
      'IGDB_CLIENT_ID environment variable is not set. Please add it to your .env file.\n' +
      'Get credentials from: https://dev.twitch.tv/console/apps'
    );
  }

  if (!clientSecret) {
    throw new Error(
      'IGDB_CLIENT_SECRET environment variable is not set. Please add it to your .env file.\n' +
      'Get credentials from: https://dev.twitch.tv/console/apps'
    );
  }

  if (!exportFilePath) {
    throw new Error(
      'Please provide the path to your Infinite Backlog CSV export file.\n' +
      'Usage: npm run fetch:games <path-to-export.csv>'
    );
  }

  console.log('🎮 Reading CSV export file...');
  const csvContent = await fs.readFile(exportFilePath, 'utf-8');
  const allRows = parseCSV(csvContent);

  console.log(`📦 Found ${allRows.length} total games in export file`);

  // Filter for only "played" games
  const playedGames = allRows.filter(row => {
    const status = row.Status || row.status || '';
    return status.toLowerCase() === 'played';
  });

  console.log(`🎯 Found ${playedGames.length} played games\n`);

  console.log('🔗 Connecting to IGDB API...');
  const client = new IGDBClient(clientId, clientSecret);

  let newGames = 0;
  let skippedGames = 0;
  let failedGames = 0;

  for (const [index, row] of playedGames.entries()) {
    // Extract IGDB ID from the IGDB ID column
    const igdbField = row['IGDB ID'] || '';
    const igdbId = extractIGDBId(igdbField);

    if (!igdbId) {
      console.warn(`⚠️  Skipping game without valid IGDB ID: ${row['Game name'] || 'Unknown'}`);
      skippedGames++;
      continue;
    }

    // Parse data from CSV columns
    const gameName = row['Game name'] || '';
    const completedDate = row['Completion date'] || '';
    const dateAdded = row['Date added'] || '';
    const lastUpdated = row['Last updated'] || '';
    const platform = row['Platform'] || '';
    const rating = row['Rating (Score)'] || '';
    const playtime = row['Playtime'] || '';
    const tags = row['Tags'] || '';
    const progressNotes = row['Progress notes'] || '';
    const collectionNotes = row['Collection notes'] || '';

    try {
      // Fetch full details from IGDB
      console.log(`🎮 [${index + 1}/${playedGames.length}] Fetching IGDB ID ${igdbId}...`);
      const details = await client.fetchGameById(igdbId);

      // Determine year for organization based on Date added
      const parsedDateAdded = dateAdded ? new Date(dateAdded) : null;
      const year = parsedDateAdded && !isNaN(parsedDateAdded.getTime())
        ? parsedDateAdded.getFullYear().toString()
        : new Date().getFullYear().toString();

      // Generate filename from slug or title
      const slug = details.slug || generateSlug(details.name);
      const filename = `${slug}.md`;
      const yearDir = path.join(GAMES_DIR, year);
      const filePath = path.join(yearDir, filename);

      // Check if file already exists (incremental update)
      try {
        await fs.access(filePath);
        skippedGames++;
        console.log(`⏭️  Skipping existing: ${year}/${filename}`);
        continue;
      } catch {
        // File doesn't exist, proceed to create it
      }

      // Ensure year directory exists
      await fs.mkdir(yearDir, { recursive: true });

      // Download cover image if available
      let imagePath: string | undefined;
      if (details.cover?.image_id) {
        try {
          const ext = '.jpg';
          const imageFilename = `${slug}${ext}`;
          const imageYearDir = path.join(IMAGES_DIR, year);
          const imageFullPath = path.join(imageYearDir, imageFilename);

          // Ensure image directory exists
          await fs.mkdir(imageYearDir, { recursive: true });

          // Download image
          await client.downloadCoverImage(details.cover.image_id, imageFullPath);
          imagePath = `../images/${year}/${imageFilename}`;
          console.log(`  📸 Downloaded cover image`);
        } catch (error) {
          console.warn(
            `  ⚠️  Failed to download cover for "${details.name}": ${
              error instanceof Error ? error.message : 'Unknown error'
            }`
          );
          // Continue without image
        }
      }

      // Combine genre names from IGDB with user tags from Infinite Backlog
      const genreTags = details.genres?.map(g => g.name) || [];
      const userTags = tags ? tags.split(',').map(t => t.trim()).filter(t => t) : [];
      const allTags = [...genreTags, ...userTags];

      // Parse rating if available
      const parsedRating = rating ? parseFloat(rating) : undefined;

      // Create metadata object combining Infinite Backlog + IGDB data
      const metadata: GameMetadata = {
        title: details.name,
        igdbId: details.id,
        link: `https://www.igdb.com/games/${details.slug || details.id}`,
        image: imagePath,
        tags: allTags.length > 0 ? allTags : undefined,
        rating: parsedRating,
        completedDate: completedDate || undefined,
        dateAdded: dateAdded || undefined,
        lastUpdated: lastUpdated || undefined,
        platform: platform || undefined,
        status: 'played',
        playtime: playtime || undefined,
        draft: false,
        summary: details.summary,
        progressNotes: progressNotes || undefined,
        collectionNotes: collectionNotes || undefined,
      };

      // Generate markdown with summary and notes as body content
      let bodyContent = details.summary || '';
      if (progressNotes) {
        bodyContent += `\n\n## Progress Notes\n\n${progressNotes}`;
      }
      if (collectionNotes) {
        bodyContent += `\n\n## Collection Notes\n\n${collectionNotes}`;
      }
      const markdown = generateBookMarkdown(metadata, bodyContent);

      // Write file
      await fs.writeFile(filePath, markdown, 'utf-8');

      newGames++;
      console.log(`✅ Created: ${year}/${filename}`);

      // Respect rate limit (4 requests per second max)
      if (index < playedGames.length - 1) {
        await sleep(RATE_LIMIT_DELAY);
      }
    } catch (error) {
      failedGames++;
      console.error(
        `❌ Failed to process IGDB ID ${igdbId}: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`
      );
      // Continue with next game
    }
  }

  console.log('\n' + '='.repeat(50));
  console.log('📊 Summary:');
  console.log(`   ✅ ${newGames} new games created`);
  console.log(`   ⏭️  ${skippedGames} games skipped`);
  if (failedGames > 0) {
    console.log(`   ❌ ${failedGames} games failed`);
  }
  console.log('='.repeat(50));
}

main().catch((error) => {
  console.error('\n❌ Fatal error:', error.message);
  process.exit(1);
});
