export type Account = {
  name: string;
  email: string;
  password: string;
  phone?: string;
};

export const ACCOUNTS_KEY = "ember-accounts";

export function readAccounts(): Account[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(ACCOUNTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveAccounts(accounts: Account[]) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
}

export function hasAccounts(): boolean {
  return readAccounts().length > 0;
}
