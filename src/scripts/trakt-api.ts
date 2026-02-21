import fs from 'fs/promises';
import path from 'path';
import type { TraktShow, TraktMovie, TraktShowExtended, TraktMovieExtended, TraktRating, TMDbImage } from './types/trakt';

const TRAKT_API_URL = 'https://api.trakt.tv';
const TRAKT_TOKEN_URL = 'https://api.trakt.tv/oauth/token';
const TMDB_API_URL = 'https://api.themoviedb.org/3';
const TMDB_IMAGE_BASE = 'https://image.tmdb.org/t/p/w500';
const TOKEN_FILE = path.join(process.cwd(), '.trakt-tokens.json');

export class TraktClient {
  private clientId: string;
  private clientSecret: string;
  private accessToken: string;
  private refreshToken?: string;
  private tmdbApiKey?: string;
  private tokenRefreshed = false;

  constructor(clientId: string, clientSecret: string, accessToken: string, tmdbApiKey?: string, refreshToken?: string) {
    this.clientId = clientId;
    this.clientSecret = clientSecret;
    this.accessToken = accessToken;
    this.tmdbApiKey = tmdbApiKey;
    this.refreshToken = refreshToken;
  }

  /**
   * Returns true if tokens were refreshed during this session.
   */
  wasTokenRefreshed(): boolean {
    return this.tokenRefreshed;
  }

  /**
   * Refresh the access token using the refresh token.
   * Writes new tokens to .trakt-tokens.json for the CI workflow to pick up.
   */
  private async refreshAccessToken(): Promise<void> {
    if (!this.refreshToken) {
      throw new Error(
        'Access token expired and no refresh token available.\n' +
        'Run "npm run trakt:auth" to get a new access token.'
      );
    }

    console.log('🔄 Access token expired, refreshing...');

    const response = await fetch(TRAKT_TOKEN_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        refresh_token: this.refreshToken,
        client_id: this.clientId,
        client_secret: this.clientSecret,
        redirect_uri: 'urn:ietf:wg:oauth:2.0:oob',
        grant_type: 'refresh_token',
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(
        `Token refresh failed: ${response.status} ${body}\n` +
        'Run "npm run trakt:auth" to re-authorize.'
      );
    }

    const data = await response.json();
    this.accessToken = data.access_token;
    this.refreshToken = data.refresh_token;
    this.tokenRefreshed = true;

    // Write new tokens to a file so the CI workflow can update secrets
    await fs.writeFile(
      TOKEN_FILE,
      JSON.stringify({
        access_token: data.access_token,
        refresh_token: data.refresh_token,
      }),
      'utf-8'
    );

    console.log('✅ Token refreshed successfully');
  }

  /**
   * Make an authenticated Trakt API request, automatically refreshing the token on 401.
   */
  private async authenticatedFetch(url: string): Promise<Response> {
    const doFetch = () =>
      fetch(url, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'jmartucci.com/1.0',
          'trakt-api-version': '2',
          'trakt-api-key': this.clientId,
          'Authorization': `Bearer ${this.accessToken}`,
        },
      });

    const response = await doFetch();

    if (response.status === 401 && !this.tokenRefreshed) {
      await this.refreshAccessToken();
      return doFetch();
    }

    return response;
  }

  async fetchWatchedShows(): Promise<TraktShow[]> {
    try {
      const response = await this.authenticatedFetch(`${TRAKT_API_URL}/sync/watched/shows?extended=full`);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`Trakt API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch shows from Trakt API');
    }
  }

  async fetchWatchedMovies(): Promise<TraktMovie[]> {
    try {
      const response = await this.authenticatedFetch(`${TRAKT_API_URL}/sync/watched/movies?extended=full`);

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please wait and try again.');
        }
        throw new Error(`Trakt API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      return data || [];
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch movies from Trakt API');
    }
  }

  async fetchShowDetails(traktId: number, retries = 3): Promise<TraktShowExtended> {
    try {
      const response = await fetch(`${TRAKT_API_URL}/shows/${traktId}?extended=full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'jmartucci.com/1.0',
          'trakt-api-version': '2',
          'trakt-api-key': this.clientId,
        },
      });

      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.fetchShowDetails(traktId, retries - 1);
        }
        throw new Error(`Failed to fetch show details: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch show details from Trakt API');
    }
  }

  async fetchMovieDetails(traktId: number, retries = 3): Promise<TraktMovieExtended> {
    try {
      const response = await fetch(`${TRAKT_API_URL}/movies/${traktId}?extended=full`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'jmartucci.com/1.0',
          'trakt-api-version': '2',
          'trakt-api-key': this.clientId,
        },
      });

      if (!response.ok) {
        if (response.status === 429 && retries > 0) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          return this.fetchMovieDetails(traktId, retries - 1);
        }
        throw new Error(`Failed to fetch movie details: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('Failed to fetch movie details from Trakt API');
    }
  }

  async fetchRatings(): Promise<Map<number, number>> {
    try {
      const response = await this.authenticatedFetch(`${TRAKT_API_URL}/sync/ratings`);

      if (!response.ok) {
        console.warn('Failed to fetch ratings from Trakt, continuing without ratings');
        return new Map();
      }

      const ratings: TraktRating[] = await response.json();
      const ratingMap = new Map<number, number>();

      for (const rating of ratings) {
        if (rating.show) {
          ratingMap.set(rating.show.ids.trakt, rating.rating);
        } else if (rating.movie) {
          ratingMap.set(rating.movie.ids.trakt, rating.rating);
        }
      }

      return ratingMap;
    } catch (error) {
      console.warn('Failed to fetch ratings:', error);
      return new Map();
    }
  }

  async fetchTMDbPosterPath(tmdbId: number, type: 'movie' | 'tv'): Promise<string | null> {
    if (!this.tmdbApiKey) {
      return null;
    }

    try {
      const endpoint = type === 'movie' ? 'movie' : 'tv';
      const response = await fetch(`${TMDB_API_URL}/${endpoint}/${tmdbId}?api_key=${this.tmdbApiKey}`);

      if (!response.ok) {
        return null;
      }

      const data: TMDbImage = await response.json();
      return data.poster_path ? `${TMDB_IMAGE_BASE}${data.poster_path}` : null;
    } catch (error) {
      console.warn(`Failed to fetch TMDb poster for ${type} ${tmdbId}`);
      return null;
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
