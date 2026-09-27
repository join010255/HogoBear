import { listMessages, sendMessage } from "../api/messages.api";

export function useMessages() { return { listMessages, sendMessage }; }