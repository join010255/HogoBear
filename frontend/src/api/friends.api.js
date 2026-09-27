import { request } from "./client";

export const listFriends = () => request("/friends");
export const addFriend = (payload) => request("/friends", { method: "POST", body: JSON.stringify(payload) });
export const requestFriend = (payload) => request("/friends/request", { method: "POST", body: JSON.stringify(payload) });
export const removeFriend = (friendId) => request(`/friends/${encodeURIComponent(friendId)}`, { method: "DELETE" });