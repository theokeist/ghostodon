import { createRestAPIClient } from "masto";
import type { Session, PageParams, GAccount, GContext, GInstance, GNotification, GSearchResult, GStatus, StreamName, GStreamEvent } from "./types.js";
import * as instance from "./instance.js";
import * as accounts from "./accounts.js";
import * as timelines from "./timelines.js";
import * as statuses from "./statuses.js";
import * as compose from "./compose.js";
import * as notifications from "./notifications.js";
import * as search from "./search.js";
import * as lists from "./lists.js";
import * as stream from "./stream.js";

export type GhostodonClient = {
  session: Session;
  instance: { get(): Promise<GInstance> };
  accounts: {
    verify(): Promise<GAccount>;
    verifyRaw(): Promise<any>;
    lookup(query: string): Promise<GAccount>;
    get(id: string): Promise<GAccount>;
    statuses(id: string, params?: any): Promise<GStatus[]>;
  };
  timelines: {
    home(params?: PageParams): Promise<GStatus[]>;
    public(params?: (PageParams & { local?: boolean; remote?: boolean; onlyMedia?: boolean })): Promise<GStatus[]>;
    list(listId: string, params?: PageParams): Promise<GStatus[]>;
  };
  statuses: {
    get(id: string): Promise<GStatus>;
    context(id: string): Promise<GContext>;
    favourite(id: string): Promise<GStatus>;
    unfavourite(id: string): Promise<GStatus>;
    reblog(id: string): Promise<GStatus>;
    unreblog(id: string): Promise<GStatus>;
    bookmark(id: string): Promise<GStatus>;
    unbookmark(id: string): Promise<GStatus>;
  };
  compose: {
    post(payload: Parameters<typeof compose.postStatus>[1]): Promise<GStatus>;
    mediaUpload(args: Parameters<typeof compose.mediaUpload>[1]): Promise<{ id: string }>;
  };
  notifications: {
    list(params?: PageParams): Promise<GNotification[]>;
    dismiss(id: string): Promise<void>;
    dismissAll(): Promise<void>;
  };
  search: {
    query(q: string, params?: Parameters<typeof search.searchQuery>[2]): Promise<GSearchResult>;
  };
  lists: {
    list(): Promise<lists.GList[]>;
    create(title: string): Promise<lists.GList>;
    update(id: string, title: string): Promise<lists.GList>;
    remove(id: string): Promise<void>;
    accounts: {
      list(listId: string): Promise<string[]>;
      add(listId: string, accountIds: string[]): Promise<void>;
      remove(listId: string, accountIds: string[]): Promise<void>;
    };
  };
  stream: {
    open(args: { stream: StreamName; tag?: string; list?: string; onEvent: (ev: GStreamEvent) => void; onError?: (err: unknown) => void }): { close(): void };
  };
};

/**
 * Create a GhostodonClient from a Session.
 */
export function createClient(session: Session): GhostodonClient {
  const masto = createRestAPIClient({ url: session.origin, accessToken: session.token });

  return {
    session,
    instance: {
      get: () => instance.getInstance(masto),
    },
    accounts: {
      verify: () => accounts.verifyCredentials(masto),
      verifyRaw: () => accounts.verifyCredentialsRaw(masto),
      lookup: (q) => accounts.lookupAccount(masto, q),
      get: (id) => accounts.getAccount(masto, id),
      statuses: (id, params) => accounts.listAccountStatuses(masto, id, params),
    },
    timelines: {
      home: (p) => timelines.home(masto, p),
      public: (p) => timelines.publicTimeline(masto, p),
      list: (listId, p) => timelines.listTimeline(masto, listId, p),
    },
    statuses: {
      get: (id) => statuses.getStatus(masto, id),
      context: (id) => statuses.getContext(masto, id),
      favourite: (id) => statuses.favourite(masto, id),
      unfavourite: (id) => statuses.unfavourite(masto, id),
      reblog: (id) => statuses.reblog(masto, id),
      unreblog: (id) => statuses.unreblog(masto, id),
      bookmark: (id) => statuses.bookmark(masto, id),
      unbookmark: (id) => statuses.unbookmark(masto, id),
    },
    compose: {
      post: (payload) => compose.postStatus(masto, payload),
      mediaUpload: (a) => compose.mediaUpload(masto, a),
    },
    notifications: {
      list: (p) => notifications.listNotifications(masto, p),
      dismiss: (id) => notifications.dismissNotification(masto, id),
      dismissAll: () => notifications.dismissAllNotifications(masto),
    },
    search: {
      query: (q, p) => search.searchQuery(masto, q, p),
    },
    lists: {
      list: () => lists.listLists(masto),
      create: (title) => lists.createList(masto, title),
      update: (id, title) => lists.updateList(masto, id, title),
      remove: (id) => lists.deleteList(masto, id),
      accounts: {
        list: (listId) => lists.listAccountsInList(masto, listId),
        add: (listId, accountIds) => lists.addAccountsToList(masto, listId, accountIds),
        remove: (listId, accountIds) => lists.removeAccountsFromList(masto, listId, accountIds),
      },
    },
    stream: {
      open: (a) => stream.openStream({ origin: session.origin, token: session.token, ...a }),
    },
  };
}
