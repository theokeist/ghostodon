import { wrapError } from "./errors.js";

export type GList = { id: string; title: string; raw?: unknown };

export async function listLists(masto: any): Promise<GList[]> {
  try {
    const raw = await masto.v1.lists.list();
    return raw.map((l: any) => ({ id: String(l.id), title: String(l.title), raw: l }));
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "lists.list failed");
  }
}

export async function createList(masto: any, title: string): Promise<GList> {
  try {
    const raw = await masto.v1.lists.create({ title });
    return { id: String(raw.id), title: String(raw.title), raw };
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "lists.create failed");
  }
}

export async function updateList(masto: any, id: string, title: string): Promise<GList> {
  try {
    const raw = await masto.v1.lists.update(id, { title });
    return { id: String(raw.id), title: String(raw.title), raw };
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "lists.update failed");
  }
}

export async function deleteList(masto: any, id: string): Promise<void> {
  try {
    await masto.v1.lists.remove(id);
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "lists.delete failed");
  }
}

export async function listAccountsInList(masto: any, id: string): Promise<string[]> {
  try {
    const raw = await masto.v1.lists.listAccounts(id);
    return raw.map((a: any) => String(a.id));
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "lists.accounts.list failed");
  }
}

export async function addAccountsToList(masto: any, id: string, accountIds: string[]): Promise<void> {
  try {
    await masto.v1.lists.addAccounts(id, { accountIds });
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "lists.accounts.add failed");
  }
}

export async function removeAccountsFromList(masto: any, id: string, accountIds: string[]): Promise<void> {
  try {
    await masto.v1.lists.removeAccounts(id, { accountIds });
  } catch (e) {
    throw wrapError(e, "HTTP_ERROR", "lists.accounts.remove failed");
  }
}
