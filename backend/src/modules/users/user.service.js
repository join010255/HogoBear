import User from './user.model.js';
import generateVerificationToken from "../../core/utils/token.js";
import generateMnemonicWrapper from "../../core/utils/bip.js";
import { Op } from "sequelize";
import CryptoClass from "../../core/utils/crypto.js";
import JWT from "../../core/utils/jwt.js";
import Conversation from "../conversations/conversation.model.js";
import Friends from "../friends/friend.model.js";

class UserService {
    async createAccount(httpReq, httpRes) {
        try {
            const userData = await User.findOne({
                where: {
                    username: httpReq.body.username
                }
            })

            if (userData) {
                return httpRes.status(409).json({
                    message: "Username already exists"
                });
            }
            let hogoToken = "";
            let Mnemonic = "";

            while (true) {

                hogoToken = await generateVerificationToken();
                Mnemonic = await generateMnemonicWrapper();
                const checkToken = await User.findOne({
                    where: {
                        [Op.or]: [
                            { tokenUser: hogoToken },
                            { recovery_accout_text: await CryptoClass.hashData(Mnemonic) },
                            { username: httpReq.body.username }
                        ]
                    }
                });
                if (!checkToken) {
                    break;
                }
            }
            await User.create({
                password: await CryptoClass.hashPasswordBcrypt(httpReq.body.password),
                tokenUser: hogoToken,
                username: httpReq.body.username,
                recovery_accout_text: await CryptoClass.hashData(Mnemonic)
            });

            httpRes.status(200).json({
                message: "Account created successfully",
                data: {
                    tokenUser: hogoToken,
                    username: httpReq.body.username,
                    recovery_accout_text: Mnemonic
                }
            });

        } catch (err) {
            console.log(err);
            httpRes.status(500).json({
                message: "Internal server error"
            });
        }
    };
    async login(httpReq, httpRes) {
        try {
            const user = await User.findOne({
                where: {
                    tokenUser: httpReq.body.tokenUser
                }
            });
            // console.log(user)
            if (!user) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }

            if (!await CryptoClass.comparePassword(httpReq.body.password, user.password)) {
                return httpRes.status(401).json({
                    message: "Invalid password"
                });
            }
            httpRes.status(200).json({
                message: "Login successfully",
                data: {
                    tokenUser: user.tokenUser,
                    username: user.username,
                    acessToken: await JWT.generateToken(user)
                }
            });
        } catch (error) {

            return httpRes.status(500).json({
                message: "Internal server error",
            });
        }
    };

    async updatePublicKeyUser(httpReq, httpRes) {
        try {
            const user = await User.findOne({
                where: {
                    id: httpReq.user.id
                }
            });
            if (!user) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }
            await user.update({
                publicKey: httpReq.body.publicKey
            });
            console.log(user)
            return httpRes.status(200).json({
                message: "User updated successfully"
            });
        } catch (error) {
            return httpRes.status(500).json({
                message: "Internal server error",
                error: error
            });
        }
    };

    async validText(httpReq, httpRes) {
        try {
            const user = await User.findOne({
                where: {
                    username: httpReq.body.username
                }
            });
            if (!user) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }
            const hachText = await CryptoClass.hashData(httpReq.body.recovery_accout_text)
            if (hachText !== user.recovery_accout_text) {
                return httpRes.status(401).json({
                    message: "Invalid recovery text"
                });
            }
            await user.update({
                password: await CryptoClass.hashPasswordBcrypt(httpReq.body.newPassword)
            });
            return httpRes.status(200).json({
                message: "Valid recovery text",
                userToken: user.tokenUser,
                username: user.username
            });
        } catch (error) {
            return httpRes.status(500).json({
                message: "Internal server error",
                error: error
            });
        }
    };
    async changePassword(httpReq, httpRes) {
        try {
            const userData = await User.findOne({
                where: {
                    tokenUser: httpReq.body.tokenUser
                }
            });
            if (!userData) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }
            const passwordHash = await CryptoClass.hashPasswordBcrypt(httpReq.body.newPassword)
            if (passwordHash === userData.password) {
                return httpRes.status(400).json({
                    message: "Password already exists"
                });
            }
            await userData.update({
                password: passwordHash
            });
            return httpRes.status(200).json({
                message: "Password changed successfully",
                data: {
                    tokenUser: userData.tokenUser,
                    username: userData.username
                }
            });

        } catch (error) {
            return httpRes.status(500).json({
                message: "Internal server error",
                error: error
            });
        }
    };
    async getKeyPublic(httpReq, httpRes) {
        try {
            const user = await User.findOne({
                where: {
                    tokenUser: httpReq.body.tokenUser
                }
            });
            if (!user) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }
            return httpRes.status(200).json({
                message: "User found",
                data: {
                    publicKey: user.publicKey,
                    tokenUser: user.tokenUser,
                }
            });
        } catch (error) {
            return httpRes.status(500).json({
                message: "Internal server error",
                error: error
            });
        }
    }

    async refreshRecoveryText(httpReq, httpRes) {
        try {
            console.log(httpReq.body)
            const user = await User.findOne({
                where: {
                    tokenUser: httpReq.body.tokenUser
                }
            });
            if (!user) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }

            if (!await CryptoClass.comparePassword(httpReq.body.password, user.password)) {
                return httpRes.status(401).json({
                    message: "Invalid password"
                });
            }

            const newMnemonic = await generateMnemonicWrapper();
            await user.update({
                recovery_accout_text: await CryptoClass.hashData(newMnemonic)
            });
            return httpRes.status(200).json({
                message: "Recovery text refreshed successfully",
                data: {
                    recovery_accout_text: newMnemonic,
                    tokenUser: user.tokenUser,
                    username: user.username
                }
            });
        } catch (error) {
            return httpRes.status(500).json({
                message: "Internal server error"
            });
        }
    }

    async getToken(httpReq, httpRes) {
        try {
            const user = await User.findOne({
                where: {
                    tokenUser: httpReq.body.tokenUser
                }
            });
            if (!user) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }
            if(!user.password || !CryptoClass.comparePassword(httpReq.body.password, user.password)){
                return httpRes.status(401).json({
                    message: "Invalid password"
                });
            }
            const accessToken = await JWT.generateToken(user);
            if(!accessToken){
                return httpRes.status(500).json({
                    message: "Failed to generate access token"
                });
            }
            return httpRes.status(200).json({
                message: "Access token generated successfully",
                data: {
                    accessToken: accessToken
                }
            });
        } catch (error) {
            return httpRes.status(500).json({
                message: "Internal server error",
                error: error
            });
        }
    };

    async tokenVerify(httpReq, httpRes){
        try {
            const userId = httpReq.user.id;
            
            const user = await User.findOne({
                where: { id: userId },
                attributes: ["id", "username", "tokenUser"] // Exclude sensitive info if needed
            });
            
            if (!user) {
                return httpRes.status(404).json({
                    message: "User not found"
                });
            }
            
            // Fetch conversations for the user
            const conversations = await Conversation.findAll({
                where: {
                    [Op.or]: [
                        { user_one: userId }
                        // You can add { user_two: userId } here if applicable in your model
                    ]
                }, 
                include : {
                    model: User,
                    as: "userTwo", // Make sure this matches your model association
                    attributes: ["tokenUser", "username"]
                }
            });

            // Fetch friends for the user
            const friends = await Friends.findAll({
                where: {
                    user_id: userId,
                    status: "ACCEPTED"
                },
                include: [
                    {
                        model: User,
                        as: "friend",
                        attributes: ["tokenUser", "username"]
                    }
                ]
            });

            return httpRes.status(200).json({
                message: "Token verified successfully",
                user: user,
                conversations: conversations,
                friends: friends
            });
        } catch (error) {
            return httpRes.status(500).json({
                message: "Internal server error during verification",
                error: error.message
            });
        }
    }
}

export default new UserService();