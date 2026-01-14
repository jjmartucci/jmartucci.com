import fs from 'fs/promises';
import type { HardcoverResponse } from './types/hardcover';

const HARDCOVER_API_URL = 'https://api.hardcover.app/v1/graphql';

export class HardcoverClient {
  private apiToken: string;

  constructor(apiToken: string) {
    this.apiToken = apiToken;
  }

  async fetchCompletedBooks(): Promise<HardcoverResponse> {
    const query = `
      query {
        me {
          user_books(
            where: {status_id: {_eq: 3}},
            order_by: {date_added: desc}
          ) {
            date_added
            reviewed_at
            review
            review_raw
            rating
            book {
              title
              slug
              cached_contributors
              cached_tags
              image {
                url
              }
            }
          }
        }
      }
    `;

    try {
      const response = await fetch(HARDCOVER_API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': this.apiToken,
        },
        body: JSON.stringify({ query }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid API token. Please check HARDCOVER_API in .env file.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`Hardcover API error: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch books from Hardcover API');
    }
  }

  async downloadImage(url: string, outputPath: string): Promise<void> {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(outputPath, buffer);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Image download failed for ${url}: ${error.message}`);
      }
      throw new Error(`Image download failed for ${url}`);
    }
  }
}
