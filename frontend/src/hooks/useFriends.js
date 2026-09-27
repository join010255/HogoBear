import { listFriends, addFriend, removeFriend } from "../api/friends.api";

export function useFriends() { return { listFriends, addFriend, removeFriend }; }