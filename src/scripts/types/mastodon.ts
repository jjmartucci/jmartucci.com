export interface MastodonToot {
  id: string;
  content: string;
  url: string;
  publishedDate: string;
  author?: string;
  inReplyTo?: string;
  mediaUrl?: string;
  mediaDescription?: string;
}

export interface TootMetadata {
  tootId: string;
  url: string;
  publishedDate: string;
  author?: string;
  draft: boolean;
  inReplyTo?: string;
  image?: string;
  mediaDescription?: string;
}
