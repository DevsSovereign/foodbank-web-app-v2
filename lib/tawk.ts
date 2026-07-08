declare global {
  interface Window {
    Tawk_API?: {
      visitor?: { name?: string; email?: string };
      maximize?: () => void;
      minimize?: () => void;
      showWidget?: () => void;
      hideWidget?: () => void;
      [key: string]: unknown;
    };
    Tawk_LoadStart?: Date;
  }
}

export const openTawkChat = () => {
  if (typeof window === "undefined") return;

  const api = window.Tawk_API;
  if (!api?.maximize) return;

  api.showWidget?.();
  api.maximize();
};
