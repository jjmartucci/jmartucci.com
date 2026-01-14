export interface HardcoverContributor {
  author: {
    id: number;
    slug: string;
    name: string;
    image?: {
      url: string;
    };
  };
  contribution: string | null;
}

export interface HardcoverTag {
  tag: string;
  tagSlug: string;
  category: string;
  categorySlug: string;
  spoilerRatio: number;
  count: number;
}

export interface HardcoverImage {
  url: string;
}

export interface HardcoverBookData {
  title: string;
  slug: string;
  cached_contributors: HardcoverContributor[];
  cached_tags: Record<string, HardcoverTag[]>;
  image: HardcoverImage | null;
}

export interface HardcoverUserBook {
  date_added: string;
  reviewed_at: string | null;
  review: string | null;
  review_raw: string | null;
  rating: number | null;
  book: HardcoverBookData;
}

export interface HardcoverResponse {
  data: {
    me: Array<{
      user_books: HardcoverUserBook[];
    }>;
  };
}

export interface BookMetadata {
  title: string;
  author?: string;
  link: string;
  image?: string;
  tags?: string[];
  rating?: number;
  dateRead: string;
  reviewedAt?: string;
  draft: boolean;
}
