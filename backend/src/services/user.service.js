import User from "../models/user.model.js";
import crypto from "crypto";
import generateVerificationToken from "../utils/token.js";
import generateMnemonic from "../utils/bip.js";
import { Op } from "sequelize";
import hashData from "../utils/crypto.js";


class UserService {
    async createAccount(response) {
        try{
            
            while(true){
                const hogoToken = await generateVerificationToken();
                const hashMnemonic = await hashData(generateMnemonic());
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
                tokenUser : hogoToken,
                recovery_accout_text : hashMnemonic,
                publicKey : response.publicKey
            })
            
            
        }catch(err){
            return err;
        }
    }
}