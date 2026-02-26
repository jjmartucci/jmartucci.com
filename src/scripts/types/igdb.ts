export interface IGDBCover {
  id: number;
  image_id: string;
  url?: string;
  width?: number;
  height?: number;
}

export interface IGDBGenre {
  id: number;
  name: string;
}

export interface IGDBPlatform {
  id: number;
  name: string;
  abbreviation?: string;
}

export interface IGDBReleaseDate {
  id: number;
  date: number;
  human: string;
  platform: number;
}

export interface IGDBGame {
  id: number;
  name: string;
  summary?: string;
  cover?: IGDBCover;
  genres?: IGDBGenre[];
  platforms?: IGDBPlatform[];
  release_dates?: IGDBReleaseDate[];
  first_release_date?: number;
  rating?: number;
  slug?: string;
}

export interface BacklogExportGame {
  igdb_id: number;
  status?: string;
  rating?: number;
  completedDate?: string;
  platform?: string;
  // Add other fields from your Infinite Backlog export
}

export interface GameMetadata {
  title: string;
  igdbId: number;
  link: string;
  image?: string;
  tags?: string[];
  rating?: number;
  completedDate?: string;
  dateAdded?: string;
  lastUpdated?: string;
  platform?: string;
  status?: string;
  playtime?: string;
  draft: boolean;
  summary?: string;
  progressNotes?: string;
  collectionNotes?: string;
}
