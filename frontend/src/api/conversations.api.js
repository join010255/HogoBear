import { request } from "./client";

export const listConversations = () => request("/conversations");
export const getConversation = (conversationId) => request(`/conversations/${encodeURIComponent(conversationId)}`);