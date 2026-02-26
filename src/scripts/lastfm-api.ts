import fs from 'fs/promises';
import type { LastfmLovedTracksResponse, LastfmLovedTrack } from './types/lastfm';

const LASTFM_API_URL = 'https://ws.audioscrobbler.com/2.0/';
const RATE_LIMIT_DELAY = 200; // 200ms between requests (5 requests/second)

export class LastfmClient {
  private apiKey: string;
  private username: string;

  constructor(apiKey: string, username: string) {
    this.apiKey = apiKey;
    this.username = username;
  }

  async getAllLovedTracks(): Promise<LastfmLovedTrack[]> {
    const allTracks: LastfmLovedTrack[] = [];
    let page = 1;
    let totalPages = 1;

    console.log(`Fetching loved tracks for user: ${this.username}`);

    // Fetch all pages
    while (page <= totalPages) {
      const response = await this.getLovedTracksPage(page);

      if (!response.lovedtracks || !response.lovedtracks.track) {
        console.warn('No tracks found in response');
        break;
      }

      allTracks.push(...response.lovedtracks.track);
      totalPages = parseInt(response.lovedtracks['@attr'].totalPages);

      console.log(`Fetched page ${page}/${totalPages} (${response.lovedtracks.track.length} tracks)`);

      page++;

      // Rate limiting: wait between requests
      if (page <= totalPages) {
        await new Promise(resolve => setTimeout(resolve, RATE_LIMIT_DELAY));
      }
    }

    return allTracks;
  }

  private async getLovedTracksPage(page: number): Promise<LastfmLovedTracksResponse> {
    const params = new URLSearchParams({
      method: 'user.getLovedTracks',
      api_key: this.apiKey,
      user: this.username,
      format: 'json',
      limit: '200', // Max allowed per page
      page: page.toString()
    });

    const response = await fetch(`${LASTFM_API_URL}?${params}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`User "${this.username}" not found on Last.fm`);
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait and try again.');
      } else if (response.status === 403) {
        throw new Error('Invalid API key or insufficient permissions');
      }
      throw new Error(`Last.fm API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getTrackInfo(artist: string, track: string, mbid?: string): Promise<any> {
    const params = new URLSearchParams({
      method: 'track.getInfo',
      api_key: this.apiKey,
      format: 'json',
    });

    // Prefer MBID if available for more accurate results
    if (mbid && mbid.trim().length > 0) {
      params.set('mbid', mbid);
    } else {
      params.set('artist', artist);
      params.set('track', track);
    }

    const response = await fetch(`${LASTFM_API_URL}?${params}`);

    if (!response.ok) {
      if (response.status === 404) {
        throw new Error(`Track not found: "${track}" by ${artist}`);
      } else if (response.status === 429) {
        throw new Error('Rate limit exceeded. Please wait and try again.');
      } else if (response.status === 403) {
        throw new Error('Invalid API key or insufficient permissions');
      }
      throw new Error(`Last.fm API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
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
