export const STORAGE_KEYS = {
  TOKEN_KEY: "fb4u_token",
  SPINNED_ITEM: "fb-spinned-item",
  FREE_DELIVERY: "fb-free-delivery",
  PROMO_CODE: "fb-promo-code",
  APPLIED_REWARD: "fb-applied-reward",
  REMEMBER_IDENTIFIER: "fb4u_remember_identifier",
};

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(STORAGE_KEYS.TOKEN_KEY, token);
  /** for proxy.ts and protected route */
  window.document.cookie = `${STORAGE_KEYS.TOKEN_KEY}=${token}; path=/; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;
  return window.sessionStorage.getItem(STORAGE_KEYS.TOKEN_KEY);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;
  // window.sessionStorage.removeItem(STORAGE_KEYS.TOKEN_KEY);
  window.sessionStorage.clear();

  /** for proxy.ts and protected route */
  document.cookie = `${STORAGE_KEYS.TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}

export function getFromStorage(key: keyof typeof STORAGE_KEYS) {
  if (typeof window === "undefined") return;
  const value = window.sessionStorage.getItem(STORAGE_KEYS[key]);

  return value ? value : "";
}

export function setToStorage(key: keyof typeof STORAGE_KEYS, value: string) {
  if (typeof window === "undefined") return;
  return window.sessionStorage.setItem(STORAGE_KEYS[key], value);
}

export function removeFromStorage(key: keyof typeof STORAGE_KEYS) {
  if (typeof window === "undefined") return;
  return window.sessionStorage.removeItem(STORAGE_KEYS[key]);
}
