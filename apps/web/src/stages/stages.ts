export type StageStatus = 'done' | 'wip' | 'todo';

export type Stage = {
  id: number;
  title: string;
  status: StageStatus;
  notes?: string;
};

export const STAGES: Stage[] = [
  { id: 1, title: 'Bootstrap monorepo (React + UI + Core)', status: 'done' },
  { id: 2, title: 'PC-first 3-pane layout shell', status: 'done' },
  {
    id: 3,
    title: 'Connect (manual token) + session persistence',
    status: 'done',
    notes: 'Fast path: instance URL + token'
  },
  {
    id: 4,
    title: 'OAuth PKCE (web + desktop) flow',
    status: 'todo',
    notes: 'PKCE helpers included; full flow staged'
  },
  { id: 5, title: 'Timelines (home/local/federated)', status: 'done' },
  { id: 6, title: 'Thread inspector (status + context)', status: 'done' },
  { id: 7, title: 'Compose (post status)', status: 'done' },
  { id: 8, title: 'Drafts', status: 'todo' },
  { id: 9, title: 'Notifications', status: 'todo' },
  { id: 10, title: 'Search (accounts/posts/tags)', status: 'done' },
  { id: 11, title: 'Explore (trends)', status: 'wip', notes: 'Trends surfaced in Search panel' },
  { id: 12, title: 'Profile viewer', status: 'done' },
  { id: 13, title: 'Followers / Following lists', status: 'wip', notes: 'Priority: profile tab list wired; pagination pending' },
  { id: 14, title: 'Lists (create/edit + timeline)', status: 'wip', notes: 'Priority: lists UI scaffolding pending' },
  { id: 15, title: 'Filters / Mutes / Blocks UI', status: 'todo' },
  { id: 16, title: 'Bookmarks', status: 'todo' },
  { id: 17, title: 'Favourites', status: 'todo' },
  { id: 18, title: 'Scheduled posts', status: 'todo' },
  { id: 19, title: 'Direct messages UX', status: 'todo' },
  {
    id: 20,
    title: 'Media upload (v2 async) + attachment tray',
    status: 'wip',
    notes: 'Basic compose upload UI wired; alt text pending'
  },
  { id: 21, title: 'Media viewer overlay', status: 'todo' },
  { id: 22, title: 'Alt-text editor', status: 'todo' },
  { id: 23, title: 'Settings: General', status: 'done' },
  { id: 24, title: 'Settings: Timeline', status: 'wip', notes: 'Tab scaffolding added' },
  { id: 25, title: 'Settings: Accounts', status: 'wip', notes: 'Tab scaffolding added' },
  { id: 26, title: 'Privacy + cache management', status: 'todo' },
  {
    id: 27,
    title: 'Command palette + keyboard shortcuts',
    status: 'wip',
    notes: 'Basic shortcuts scaffolded'
  },
  {
    id: 28,
    title: 'Packaging / release (Tauri)',
    status: 'wip',
    notes: 'Desktop wrapper included (minimal)'
  }
];
