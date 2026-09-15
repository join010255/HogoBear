import User from './user.model.js';
import generateVerificationToken from "../../core/utils/token.js";
import generateMnemonicWrapper from "../../core/utils/bip.js";
import { Op } from "sequelize";
import CryptoClass from "../../core/utils/crypto.js";
import JWT from "../../core/utils/jwt.js";

class UserService {
    async createAccount(httpReq, httpRes) {
        try{
            const userData = await User.findOne({
                where : {
                    username : httpReq.body.username
                }
            })
            
            if(userData){
                return httpRes.status(400).json({
                    message : "Username already exists"
                });
            }
            let hogoToken = "";
            let Mnemonic = "";
            
            while(true){
               
                hogoToken = await generateVerificationToken();
                Mnemonic = await generateMnemonicWrapper();
                const checkToken =  await User.findOne({
                    where : {
                        [Op.or]: [
                            {tokenUser : hogoToken},
                            {recovery_accout_text : await CryptoClass.hashData(Mnemonic)},
                            {username : httpReq.body.username}
                        ]
                    }
                });
                if(!checkToken){
                    break;
                }
            }
            console.log(Mnemonic)
            await User.create({
                password : await CryptoClass.hashPasswordBcrypt(httpReq.body.password),
                tokenUser : hogoToken,
                username : httpReq.body.username,
                recovery_accout_text : await CryptoClass.hashData(Mnemonic)
            });
            
            httpRes.status(200).json({
                message : "Account created successfully",
                data : {
                    tokenUser : hogoToken,
                    username : httpReq.body.username,
                    recovery_accout_text : Mnemonic
                }
            });

        }catch(err){
            console.log(err);
            httpRes.status(500).json({
                message : "Internal server error"
            });
        }
    };
    async login(httpReq, httpRes){
        try {
            const user = await User.findOne({
                where : {
                    tokenUser : httpReq.body.tokenUser
                }
            });
            // console.log(user)
            if(!user){
                return httpRes.status(404).json({
                    message : "User not found"
                });
            }

            if(!await CryptoClass.comparePassword(httpReq.body.password, user.password)){
                return httpRes.status(401).json({
                    message : "Invalid password"
                });
            }
            httpRes.status(200).json({
                message : "Login successfully",
                data : {
                    tokenUser : user.tokenUser,
                    username : user.username,
                    acessToken : await JWT.generateToken(user)
                }
            });
        } catch (error) {

            return httpRes.status(500).json({
                message : "Internal server error",
            });
        }
    };

    async updatePublicKeyUser(httpReq, httpRes){
        try {
            const user = await User.findOne({
                where : {
                    tokenUser : httpReq.body.tokenUser
                }
            });
            if(!user){
                return httpRes.status(404).json({
                    message : "User not found"
                });
            }
            await user.update({
                publicKey : httpReq.body.publicKey
            });
            return httpRes.status(200).json({
                message : "User updated successfully"
            });
        } catch (error) {
            return httpRes.status(500).json({
                message : "Internal server error",
                error : error
            });
        }
    };

    async validText(httpReq, httpRes){
        try {
            const user = await User.findOne({
                where : {
                    username : httpReq.body.username
                }
            });
            if(!user){
                return httpRes.status(404).json({
                    message : "User not found"
                });
            }
            const hachText = await CryptoClass.hashData(httpReq.body.recovery_accout_text)
            if(hachText !== user.recovery_accout_text){
                return httpRes.status(401).json({
                    message : "Invalid recovery text"
                });
            }
            await user.update({
                password : await CryptoClass.hashPasswordBcrypt(httpReq.body.newPassword)
            });
            return httpRes.status(200).json({
                message : "Valid recovery text",
                userToken : user.tokenUser,
                username : user.username
            });
        } catch (error) {
            return httpRes.status(500).json({
                message : "Internal server error",
                error : error
            });
        }
    };
    async changePassword(httpReq, httpRes){
        try {
            const  userData = await User.findOne({
                where : {
                    tokenUser : httpReq.body.tokenUser
                }
            });
            if(!userData){
                return httpRes.status(404).json({
                    message : "User not found"
                });
            }
            const passwordHash = await CryptoClass.hashPasswordBcrypt(httpReq.body.newPassword)
            if(passwordHash === userData.password){
                return httpRes.status(400).json({
                    message : "Password already exists"
                });
            }
            await userData.update({
                password : passwordHash
            });
            return httpRes.status(200).json({
                message : "Password changed successfully",
                data : {
                    tokenUser : userData.tokenUser,
                    username : userData.username
                }
            });

        } catch (error) {
            
        }
    }
}

export default new UserService();