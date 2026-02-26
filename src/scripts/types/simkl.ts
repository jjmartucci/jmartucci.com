export interface SimklShow {
  show: {
    title: string;
    year: number;
    ids: {
      simkl: number;
      slug: string;
      imdb?: string;
      tmdb?: number;
    };
  };
  last_watched_at: string;
  status: string;
  user_rating?: number;
  last_watched?: string;
  next_to_watch?: string;
  watched_episodes_count: number;
  total_episodes_count: number;
  review?: string;
}

export interface SimklShowDetails {
  title: string;
  year: number;
  ids: {
    simkl: number;
    slug: string;
    imdb?: string;
    tmdb?: number;
  };
  overview?: string;
  poster?: string;
  genres?: string[];
  type?: string;
  first_aired?: string;
  status?: string;
  rating?: string;
  network?: string;
}

export interface SimklMovie {
  movie: {
    title: string;
    year: number;
    ids: {
      simkl: number;
      slug: string;
      imdb?: string;
      tmdb?: number;
    };
  };
  last_watched_at: string;
  user_rating?: number;
  review?: string;
}

export interface SimklMovieDetails {
  title: string;
  year: number;
  ids: {
    simkl: number;
    slug: string;
    imdb?: string;
    tmdb?: number;
  };
  overview?: string;
  poster?: string;
  genres?: string[];
  type?: string;
  released?: string;
  rating?: string;
  runtime?: number;
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
