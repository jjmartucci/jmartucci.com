import fs from 'fs/promises';
import type { SimklShow, SimklShowDetails, SimklMovie, SimklMovieDetails } from './types/simkl';

const SIMKL_API_URL = 'https://api.simkl.com';

export class SimklClient {
  private clientId: string;
  private accessToken: string;

  constructor(clientId: string, accessToken: string) {
    this.clientId = clientId;
    this.accessToken = accessToken;
  }

  async fetchWatchedShows(): Promise<SimklShow[]> {
    try {
      const response = await fetch(`${SIMKL_API_URL}/sync/all-items/shows/watched`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'simkl-api-key': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid SIMKL access token. Run "npm run simkl:auth" to get a new access token.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`SIMKL API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.shows || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch shows from SIMKL API');
    }
  }

  async fetchWatchedMovies(): Promise<SimklMovie[]> {
    try {
      const response = await fetch(`${SIMKL_API_URL}/sync/all-items/movies/watched`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'simkl-api-key': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Invalid SIMKL access token. Run "npm run simkl:auth" to get a new access token.');
        } else if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`SIMKL API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data.movies || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch movies from SIMKL API');
    }
  }

  async fetchShowDetails(simklId: number, retries = 3): Promise<SimklShowDetails> {
    try {
      const response = await fetch(`${SIMKL_API_URL}/tv/${simklId}?extended=full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'simkl-api-key': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 412 && retries > 0) {
          // Rate limited or precondition failed, wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.fetchShowDetails(simklId, retries - 1);
        }
        throw new Error(`Failed to fetch show details: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch show details from SIMKL API');
    }
  }

  async fetchMovieDetails(simklId: number, retries = 3): Promise<SimklMovieDetails> {
    try {
      const response = await fetch(`${SIMKL_API_URL}/movies/${simklId}?extended=full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'simkl-api-key': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 412 && retries > 0) {
          // Rate limited or precondition failed, wait and retry
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.fetchMovieDetails(simklId, retries - 1);
        }
        throw new Error(`Failed to fetch movie details: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch movie details from SIMKL API');
    }
  }

  async downloadImage(url: string, outputPath: string): Promise<void> {
    try {
      // SIMKL poster URLs are relative paths, need to construct full URL
      // Format is typically: https://wsrv.nl/?url=https://simkl.in/posters/{path}_m.jpg
      let fullUrl: string;

      if (url.startsWith('http')) {
        fullUrl = url;
      } else {
        // SIMKL uses wsrv.nl as CDN for images
        // The poster path needs _m.jpg or _ca.jpg suffix for different sizes
        fullUrl = `https://wsrv.nl/?url=https://simkl.in/posters/${url}_m.jpg`;
      }

      const response = await fetch(fullUrl);

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
