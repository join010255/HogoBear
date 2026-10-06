import { where } from 'sequelize';
import Friends from './friend.model.js';
import Users from '../users/user.model.js';
import { Op } from "sequelize";
import Conversation from '../conversations/conversation.model.js';


class FriendService {
    async getFriends(httpReq, httpRes) {
        try {
            const userId = httpReq.user.id;
            const allUserFriends = await Friends.findAll({
                where: {
                    user_id: userId,
                    status: "ACCEPTED"
                },
                include: [
                    {
                        model: Users,
                        as: "friend",
                        attributes: ["tokenUser", "username"]
                    }
                ]
            })
            if (allUserFriends.length == 0) {
                return httpRes.status(404).json({
                    message: "user dont have friends"
                })
            }
            return httpRes.status(200).json({
                data: allUserFriends
            })
        } catch (error) {
            console.log(error);
            return httpRes.status(500).json({
                error: "server Error"
            })
        }
    }
    // this methode block files this paramter put requests
    async blockFriend(httpReq, httpRes) {
        try {
            const friendUser = await Users.findOne({
                where: { tokenUser: httpReq.body.friend_token }
            });
            if (!friendUser) {
                return httpRes.status(404).json({ error: "this token not found" });
            }

            const friendData = await Friends.findOne({
                where: {
                    user_id: httpReq.user.id,
                    friend_id: friendUser.id
                }
            });

            if (!friendData) {
                return httpRes.status(404).json({
                    message: "friend not found"
                })
            }
            friendData.is_blocked = true
            await friendData.save()

            return httpRes.status(200).json({
                message: "user is blocked",
                data: friendData
            })
        } catch (error) {
            console.log(error);
            return httpRes.status(500).json({
                error: "server Error"
            })
        }
    }

    async addFriend(httpReq, httpRes) {
        try {
            const friendData = await Users.findOne({
                where: {
                    tokenUser: httpReq.body.friend_token
                }
            })
            if (!friendData) {
                return httpRes.status(404).json({
                    error: "this token not found"
                })
            }
            const userToken = httpReq.user.id;
            const existingFriendship = await Friends.findOne({
                where: {
                    [Op.or]: [
                        { user_id: userToken, friend_id: friendData.id },
                        { user_id: friendData.id, friend_id: userToken }
                    ]
                }
            });
            if (existingFriendship) {
                if (!existingFriendship.is_blocked) {
                    return httpRes.status(403).json({
                        error: "this user if blocked"
                    })
                }

                return httpRes.status(400).json({
                    message: "this is your frand"
                })
            }
            
            await Friends.create({
                user_id: userToken,
                friend_id: friendData.id,
                status: "PENDING"
            });
            return httpRes.status(200).json({
                message: "Friend request sent successfully"
            });
        } catch (error) {
            return httpRes.status(500).json({
                error: "Internal server error"
            });
        }
    }

    async acceptFriend(httpReq, httpRes) {
        try {
            const friendData = await Users.findOne({
                where: {
                    tokenUser: httpReq.body.friend_token
                }
            });
            if (!friendData) {
                return httpRes.status(404).json({ error: "User not found" });
            }

            const userId = httpReq.user.id;
            
            // The friend request was sent by friendData.id TO userId
            const friendRequest = await Friends.findOne({
                where: {
                    user_id: friendData.id,
                    friend_id: userId,
                    status: "PENDING"
                }
            });

            if (!friendRequest) {
                return httpRes.status(404).json({ error: "Friend request not found" });
            }

            friendRequest.status = "ACCEPTED";
            await friendRequest.save();

            // create reverse friendship for easier querying, or just rely on one record
            // since getFriends only checks user_id, let's create the reverse record
            await Friends.create({
                user_id: userId,
                friend_id: friendData.id,
                status: "ACCEPTED"
            });

            // create conversation when request is accepted
            await Conversation.create({
                user_one: friendData.id,
                user_two: userId,
            });

            return httpRes.status(200).json({ message: "Friend request accepted and conversation started" });
        } catch (error) {
            console.error(error);
            return httpRes.status(500).json({ error: "Internal server error" });
        }
    }

    async getFriendRequests(httpReq, httpRes) {
        try {
            const userId = httpReq.user.id;
            const requests = await Friends.findAll({
                where: {
                    friend_id: userId,
                    status: "PENDING"
                },
                include: [
                    {
                        model: Users,
                        as: "user", // we need the user who sent the request. Wait, does friend.model have an alias for user_id?
                    }
                ]
            });
            
            return httpRes.status(200).json({ data: requests });
        } catch (error) {
            console.error(error);
            return httpRes.status(500).json({ error: "Internal server error" });
        }
    }
}
export default new FriendService();