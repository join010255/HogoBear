import { request } from "./client";

export const register = (payload) => request("/users/register", { method: "POST", body: JSON.stringify(payload) });
export const login = (payload) => request("/users/login", { method: "POST", body: JSON.stringify(payload) });
export const recover = (payload) => request("/users/recovery", { method: "POST", body: JSON.stringify(payload) });