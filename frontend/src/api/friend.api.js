import api from "./api";

class FriendApi {
    async addFriend(friend_token) {
        try {
            return await api.post("/friends/add-friend", { friend_token });
        } catch (error) {
            throw error;
        }
    }
}

export default new FriendApi();
