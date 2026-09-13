import Friends from "../models/friend.model.js";
import Users from "../models/user.model.js";


class FriendService{
    async getFriends(httpReq, httpRes){
        try{
            const userData = httpReq.body.user
            const allUserFriends = await Friends.findAll({
                where : {
                    user_id : userData.id
                },
                include : [
                    {
                        model : Users,
                        as : "friends",
                        attributes : ["tokenUser", "username"]
                    }
                ]
            })
            if(allUserFriends.length == 0){
                return httpRes.status(404).json({
                    message : "user dont have friends"
                })
            }
            httpRes.status(200).json({

            })
        }catch(erorr){
            httpRes.status(500).json({
                error : "server Error"
            })
        }
    }
    // this methode block files this paramter put requests
    async blockFriend(httpReq, httpRes){
        try{
            const userFriends = await Friends.findAll({
                where : {
                    user_id : httpReq.body.user.id
                }
            });
            const friendData = userFriends.find(
                friend => friend.friend_id === httpReq.frande_token
            )
            if(!friendData){
                return httpRes.status(401).json({
                    message : "user not found"
                })
            }
            friendData.is_blocked = true
            await userFriends.update(friendData)

            httpRes.status(200).json({
                message : "user is blocked",
                data : friendData
            })
        }catch(error){
            httpRes.status(500).json({
                error : "server Error"
            })
        }
    }

    async 
}
export default new FriendService();