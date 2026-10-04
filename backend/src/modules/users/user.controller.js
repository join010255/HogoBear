import UserService from './user.service.js';


class UserController {
    async createAccount(httpReq, httpRes) {
        try{
            await UserService.createAccount(httpReq, httpRes);
        }catch(error){
            httpRes.status(500).json({
                message: "Server Error"
            })
        }
    }

    async login(httpReq, httpRes) {
        await UserService.login(httpReq, httpRes);
    }

    async updatePublicKeyUser(httpReq, httpRes) {
        await UserService.updatePublicKeyUser(httpReq, httpRes);
    }

    async refreshRecoveryText(httpReq, httpRes) {
        await UserService.refreshRecoveryText(httpReq, httpRes);
    }
    async getToken(httpReq, httpRes) {
        await UserService.getToken(httpReq, httpRes);
    }
}

export default new UserController();