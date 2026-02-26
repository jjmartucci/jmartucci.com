import { getCollection } from "astro:content";

// Shared types
export type StreamItemType = 'book' | 'music' | 'watching' | 'game' | 'toot';

export type StreamItem = {
  type: StreamItemType;
  date: Date;
  data: any;
};

export type GroupedItems = {
  books: StreamItem[];
  movies: StreamItem[];
  music: StreamItem[];
  tv: StreamItem[];
  games: StreamItem[];
  toots: StreamItem[];
};

export type ItemsByYearMonth = Record<number, Record<string, StreamItem[]>>;

// Data fetching functions
export async function fetchAllBooks(): Promise<StreamItem[]> {
  return (await getCollection("books"))
    .filter((book) => process.env.NODE_ENV === "production" ? !book.data.draft : true)
    .map(book => ({
      type: 'book' as const,
      date: book.data.reviewedAt || book.data.dateRead,
      data: book
    }));
}

export async function fetchAllMusic(): Promise<StreamItem[]> {
  return (await getCollection("music"))
    .filter((track) => process.env.NODE_ENV === "production" ? !track.data.draft : true)
    .map(track => ({
      type: 'music' as const,
      date: track.data.lovedDate,
      data: track
    }));
}

export async function fetchAllWatching(): Promise<StreamItem[]> {
  return (await getCollection("watching"))
    .filter((item) => process.env.NODE_ENV === "production" ? !item.data.draft : true)
    .map(item => ({
      type: 'watching' as const,
      date: item.data.lastWatchedDate,
      data: item
    }));
}

export async function fetchAllGames(): Promise<StreamItem[]> {
  return (await getCollection("games"))
    .filter((game) => process.env.NODE_ENV === "production" ? !game.data.draft : true)
    .filter((game) => game.data.rating !== undefined && game.data.rating !== null)
    .map(game => ({
      type: 'game' as const,
      date: game.data.dateAdded,
      data: game
    }));
}

export async function fetchAllToots(): Promise<StreamItem[]> {
  const currentYear = new Date().getFullYear();
  return (await getCollection("toots"))
    .filter((toot) => process.env.NODE_ENV === "production" ? !toot.data.draft : true)
    .filter((toot) => !toot.data.inReplyTo)
    .filter((toot) => new Date(toot.data.publishedDate).getFullYear() === currentYear)
    .map(toot => ({
      type: 'toot' as const,
      date: toot.data.publishedDate,
      data: toot
    }));
}

// Fetch all items combined and sorted
export async function fetchAllItems(): Promise<StreamItem[]> {
  const [books, music, watching, games, toots] = await Promise.all([
    fetchAllBooks(),
    fetchAllMusic(),
    fetchAllWatching(),
    fetchAllGames(),
    fetchAllToots(),
  ]);

  return [...books, ...music, ...watching, ...games, ...toots]
    .filter(item => item.date)
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

// Group items by year and month
export function groupByYearMonth(items: StreamItem[]): ItemsByYearMonth {
  const currentYear = new Date().getFullYear();

  return items.reduce<ItemsByYearMonth>((acc, item) => {
    const date = new Date(item.date);
    const year = date.getFullYear();
    const month = year === currentYear
      ? date.toLocaleDateString("en-US", { month: "long" })
      : "All Year";

    if (!acc[year]) acc[year] = {};
    if (!acc[year][month]) acc[year][month] = [];
    acc[year][month].push(item);

    return acc;
  }, {});
}

// Group items by type within a set
export function groupByType(items: StreamItem[]): GroupedItems {
  return {
    books: items.filter(i => i.type === 'book'),
    movies: items.filter(i => i.type === 'watching' && i.data.data.type === 'movie'),
    music: items.filter(i => i.type === 'music'),
    tv: items.filter(i => i.type === 'watching' && i.data.data.type === 'tv'),
    games: items.filter(i => i.type === 'game'),
    toots: items.filter(i => i.type === 'toot'),
  };
}

// Count by category
export function getCategoryCounts(items: StreamItem[]) {
  const groups = groupByType(items);
  return {
    books: groups.books.length,
    movies: groups.movies.length,
    tracks: groups.music.length,
    tv: groups.tv.length,
    games: groups.games.length,
    toots: groups.toots.length,
  };
}

// Rating helpers
export function normalizeRating(rating: number | undefined, maxScale: number = 5): number | null {
  if (!rating || rating === 0) return null;
  return (rating / maxScale) * 10;
}

export function convertToFiveStars(rating: number | undefined, maxScale: number = 5): number | null {
  if (!rating || rating === 0) return null;
  return (rating / maxScale) * 5;
}

export function renderStarRating(rating: number | undefined, maxScale: number = 5): string {
  const fiveStarRating = convertToFiveStars(rating, maxScale);
  if (fiveStarRating === null) return "";

  const fullStars = Math.floor(fiveStarRating);
  const hasHalfStar = fiveStarRating % 1 >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  let stars = '';
  const starId = `star-${Math.random().toString(36).substr(2, 9)}`;

  for (let i = 0; i < fullStars; i++) {
    stars += '<svg class="star" width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="#efb045" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  }

  if (hasHalfStar) {
    stars += `<svg class="star" width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><defs><linearGradient id="${starId}"><stop offset="50%" stop-color="#efb045"/><stop offset="50%" stop-color="transparent"/></linearGradient></defs><path fill="url(#${starId})" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/><path fill="none" stroke="#efb045" stroke-width="1" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>`;
  }

  for (let i = 0; i < emptyStars; i++) {
    stars += '<svg class="star" width="14" height="14" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path fill="none" stroke="#efb045" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';
  }

  return stars;
}

// Type metadata for sub-pages
export const STREAM_TYPES = {
  books: {
    label: 'Books',
    fetchItems: async () => {
      const items = await fetchAllBooks();
      return items.filter(i => i.date).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    ratingScale: 5,
  },
  movies: {
    label: 'Movies',
    fetchItems: async () => {
      const watching = await fetchAllWatching();
      return watching
        .filter(i => i.data.data.type === 'movie' && i.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    ratingScale: 10,
  },
  tv: {
    label: 'TV Shows',
    fetchItems: async () => {
      const watching = await fetchAllWatching();
      return watching
        .filter(i => i.data.data.type === 'tv' && i.date)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    ratingScale: 10,
  },
  music: {
    label: 'Songs',
    fetchItems: async () => {
      const items = await fetchAllMusic();
      return items.filter(i => i.date).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    ratingScale: null,
  },
  games: {
    label: 'Games',
    fetchItems: async () => {
      const items = await fetchAllGames();
      return items.filter(i => i.date).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    ratingScale: 10,
  },
  toots: {
    label: 'Mastodon',
    fetchItems: async () => {
      const items = await fetchAllToots();
      return items.filter(i => i.date).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    },
    ratingScale: null,
  },
} as const;

export type StreamTypeKey = keyof typeof STREAM_TYPES;
