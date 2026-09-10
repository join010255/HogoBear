import User from "../models/user.model.js";
import generateVerificationToken from "../utils/token.js";
import generateMnemonic from "../utils/bip.js";
import { Op } from "sequelize";
import hashData from "../utils/crypto.js";

class UserService {
    async createAccount(httpReq, httpRes) {
        try{
            let hogoToken = "";
            let hashMnemonic = "";
            while(true){
                hogoToken = await generateVerificationToken();
                hashMnemonic = await hashData(generateMnemonic());
                const checkToken =  await User.findOne({
                    where : {
                        [Op.or]: [
                            {tokenUser : hogoToken},
                            {mnemonicUser : hashMnemonic}
                        ]
                    }
                });
                if(!checkToken){
                    break;
                }
            }
            await User.create({
                password : hashData(httpReq.password),
                tokenUser : hogoToken,
                recovery_accout_text : hashMnemonic
            });
            return httpRes.status(200).json({
                message : "Account created successfully",
                data : {
                    tokenUser : hogoToken
                }
            });

        }catch(err){
            return httpRes.status(500).json({
                message : "Internal server error",
                error : err
            });
        }
    };
    async login(httpReq, httpRes){
        try {
            const user = await User.findOne({
                where : {
                    tokenUser : httpReq.tokenUser
                }
            });
            if(!user){
                return httpRes.status(404).json({
                    message : "User not found"
                });
            }
            if(user.password !== httpReq.password){
                return httpRes.status(401).json({
                    message : "Invalid password"
                });
            }
            return httpRes.status(200).json({
                message : "Login successfully",
                data : {
                    tokenUser : user.tokenUser
                }
            });
        } catch (error) {
            return httpRes.status(500).json({
                message : "Internal server error",
                error : error
            });
        }
    }
}