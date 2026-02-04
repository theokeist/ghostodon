// Stable app-facing types (normalized). Keep these small and add fields as the UI truly needs them.

export type Session = {
  origin: string;
  token: string;
  accountId: string;
  acct: string;
};

export type PageParams = {
  limit?: number;
  maxId?: string;
  minId?: string;
  sinceId?: string;
};

export type GAccount = {
  id: string;
  acct: string;
  displayName: string;
  avatar: string;
  header?: string;
  url?: string;
  noteHtml?: string;
  followersCount?: number;
  followingCount?: number;
  statusesCount?: number;
  locked?: boolean;
  bot?: boolean;
  raw?: unknown;
};

export type GMedia = {
  id: string;
  type?: string;
  url?: string;
  previewUrl?: string;
  description?: string | null;
  raw?: unknown;
};

export type GStatus = {
  id: string;
  createdAt: string;
  editedAt?: string;
  url?: string;
  contentHtml: string;
  spoilerText?: string;
  sensitive?: boolean;
  visibility?: "public" | "unlisted" | "private" | "direct";
  inReplyToId?: string;
  reblog?: GStatus;
  repliesCount?: number;
  reblogsCount?: number;
  favouritesCount?: number;
  account: GAccount;
  media?: GMedia[];
  language?: string;
  raw?: unknown;
};

export type GContext = {
  ancestors: GStatus[];
  descendants: GStatus[];
};

export type GNotification = {
  id: string;
  type: string;
  createdAt: string;
  account?: GAccount;
  status?: GStatus;
  raw?: unknown;
};

export type GSearchResult = {
  accounts: GAccount[];
  statuses: GStatus[];
  hashtags: GTag[];
  raw?: unknown;
};

export type GTag = {
  name: string;
  url?: string;
  history?: { day: string; uses: number; accounts: number }[];
  raw?: unknown;
};

export type GInstance = {
  title?: string;
  version?: string;
  descriptionHtml?: string;
  streamingBase?: string;
  raw?: unknown;
};

export type StreamName =
  | "user"
  | "public"
  | "public:local"
  | "direct"
  | "hashtag"
  | "hashtag:local"
  | "list";

export type GStreamEvent =
  | { event: "update"; status: GStatus; raw: unknown }
  | { event: "notification"; notification: GNotification; raw: unknown }
  | { event: "delete"; id: string; raw: unknown }
  | { event: string; raw: unknown };
