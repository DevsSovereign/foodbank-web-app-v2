const TOKEN_KEY = "fb4u_token";

export function setAuthToken(token: string) {
  if (typeof window === "undefined") return;

  window.sessionStorage.setItem(TOKEN_KEY, token);
  window.document.cookie = `${TOKEN_KEY}=${token}; path=/; SameSite=Lax`;
}

export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return window.sessionStorage.getItem(TOKEN_KEY);
}

export function clearAuthToken() {
  if (typeof window === "undefined") return;

  window.sessionStorage.removeItem(TOKEN_KEY);
  document.cookie = `${TOKEN_KEY}=; path=/; max-age=0; SameSite=Lax`;
}
