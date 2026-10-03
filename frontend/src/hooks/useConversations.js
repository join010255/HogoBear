import { listConversations, getConversation } from "../api/conversations.api";

export function useConversations() { return { listConversations, getConversation }; }