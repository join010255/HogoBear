import { useSyncExternalStore } from "react";

let session = { token: null, user: null };
const listeners = new Set();
const notify = () => listeners.forEach((listener) => listener());

export const getToken = () => session.token;
export const setAuthSession = (nextSession) => { session = nextSession; notify(); };
export const clearAuthSession = () => { session = { token: null, user: null }; notify(); };
export function useAuthStore() {
  return useSyncExternalStore((listener) => { listeners.add(listener); return () => listeners.delete(listener); }, () => session, () => session);
}