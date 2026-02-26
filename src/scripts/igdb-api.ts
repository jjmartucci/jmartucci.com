import fs from 'fs/promises';
import type { IGDBGame } from './types/igdb';

const IGDB_API_URL = 'https://api.igdb.com/v4';
const TWITCH_OAUTH_URL = 'https://id.twitch.tv/oauth2/token';

export class IGDBClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken?: string;
  private tokenExpiry?: number;

  constructor(clientId: string, clientSecret: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
  }

  private async getAccessToken(): Promise<string> {
    // Check if we have a valid cached token
    if (this.accessToken && this.tokenExpiry && Date.now() < this.tokenExpiry) {
      return this.accessToken;
    }

    // Request a new token from Twitch
    const params = new URLSearchParams({
      client_id: this.clientId,
      client_secret: this.clientSecret,
      grant_type: 'client_credentials'
    });

    const response = await fetch(`${TWITCH_OAUTH_URL}?${params}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error(`Failed to get Twitch access token: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    // Tokens expire in 'expires_in' seconds, cache with 5 minute buffer
    this.tokenExpiry = Date.now() + ((data.expires_in - 300) * 1000);

    return this.accessToken;
  }

  async fetchGameById(igdbId: number): Promise<IGDBGame> {
    const token = await this.getAccessToken();

    // IGDB API uses POST with a query body
    const body = `fields name,summary,cover.image_id,cover.url,genres.name,platforms.name,platforms.abbreviation,first_release_date,rating,slug; where id = ${igdbId};`;

    const response = await fetch(`${IGDB_API_URL}/games`, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Client-ID': this.clientId,
        'Authorization': `Bearer ${token}`,
      },
      body: body,
    });

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('Invalid IGDB/Twitch credentials. Please check IGDB_CLIENT_ID and IGDB_CLIENT_SECRET in .env file.');
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait and try again.');
      }
      throw new Error(`IGDB API error: ${response.status} ${response.statusText}`);
    }

    const games = await response.json();

    if (!games || games.length === 0) {
      throw new Error(`Game with ID ${igdbId} not found in IGDB`);
    }

    return games[0];
  }

  async downloadCoverImage(imageId: string, outputPath: string): Promise<void> {
    try {
      // IGDB image URLs follow the pattern:
      // https://images.igdb.com/igdb/image/upload/t_{size}/{image_id}.jpg
      // Sizes: cover_small, cover_big, 720p, 1080p, etc.
      const imageUrl = `https://images.igdb.com/igdb/image/upload/t_cover_big/${imageId}.jpg`;

      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to download image: ${response.status} ${response.statusText}`);
      }

      const arrayBuffer = await response.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      await fs.writeFile(outputPath, buffer);
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Image download failed for ${imageId}: ${error.message}`);
      }
      throw new Error(`Image download failed for ${imageId}`);
    }
  }
}
