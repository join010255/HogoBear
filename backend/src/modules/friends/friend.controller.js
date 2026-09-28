import FriendService from "./friend.service.js";

class FriendController {
    async getFriends(httpReq, httpRes){
        await FriendService.getFriends(httpReq, httpRes);
    }
    async addFriend(httpReq, httpRes){
        await FriendService.addFriend(httpReq, httpRes);
    }
    async blockFriend(httpReq, httpRes){
        await FriendService.blockFriend(httpReq, httpRes);
    }
    async unblockFriend(httpReq, httpRes){
        await FriendService.unblockFriend(httpReq, httpRes);
    }
    async acceptFriend(httpReq, httpRes){
        await FriendService.acceptFriend(httpReq, httpRes);
    }
    async getFriendRequests(httpReq, httpRes){
        await FriendService.getFriendRequests(httpReq, httpRes);
    }
}
export default new FriendController();