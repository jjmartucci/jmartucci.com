export interface TraktShow {
  show: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb?: string;
      tmdb?: number;
    };
  };
  last_watched_at: string;
  plays: number;
}

export interface TraktMovie {
  movie: {
    title: string;
    year: number;
    ids: {
      trakt: number;
      slug: string;
      imdb?: string;
      tmdb?: number;
    };
  };
  last_watched_at: string;
  plays: number;
}

export interface TraktShowExtended {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb?: string;
    tmdb?: number;
  };
  overview?: string;
  genres?: string[];
  status?: string;
  rating?: number;
  first_aired?: string;
}

export interface TraktMovieExtended {
  title: string;
  year: number;
  ids: {
    trakt: number;
    slug: string;
    imdb?: string;
    tmdb?: number;
  };
  overview?: string;
  genres?: string[];
  released?: string;
  rating?: number;
  runtime?: number;
}

export interface TraktRating {
  rating: number;
  rated_at: string;
  type: string;
  show?: {
    ids: {
      trakt: number;
    };
  };
  movie?: {
    ids: {
      trakt: number;
    };
  };
}

export interface TMDbImage {
  poster_path?: string;
  backdrop_path?: string;
}

export interface WatchingMetadata {
  title: string;
  year: number;
  type: string;
  link: string;
  image?: string;
  tags?: string[];
  rating?: number;
  lastWatchedDate: string;
  status?: string;
  draft: boolean;
  overview?: string;
}
