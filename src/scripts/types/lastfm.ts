export interface LastfmLovedTrack {
  name: string;
  mbid: string;
  url: string;
  artist: {
    name: string;
    mbid: string;
    url: string;
  };
  date: {
    uts: string;
    '#text': string;
  };
  image: Array<{
    size: string;
    '#text': string;
  }>;
}

export interface LastfmLovedTracksResponse {
  lovedtracks: {
    '@attr': {
      user: string;
      page: string;
      perPage: string;
      totalPages: string;
      total: string;
    };
    track: LastfmLovedTrack[];
  };
}

export interface TrackMetadata {
  title: string;
  artist: string;
  link: string;
  image?: string;
  lovedDate: string;
  mbid?: string;
  draft: boolean;
}
