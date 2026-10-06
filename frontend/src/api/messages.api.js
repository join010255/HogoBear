import { request } from "./client";

export const listMessages = (conversationId) => request(`/conversations/${encodeURIComponent(conversationId)}/messages`);
export const sendMessage = (conversationId, payload) => request(`/conversations/${encodeURIComponent(conversationId)}/messages`, { method: "POST", body: JSON.stringify(payload) });