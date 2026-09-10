import UserService from "../services/user.service.js";


class UserController {
    async createAccount(httpReq, httpRes) {
        return await UserService.createAccount(httpReq, httpRes);
    }

    async login(httpReq, httpRes) {
        return await UserService.login(httpReq, httpRes);
    }

    async updatePublicKeyUser(httpReq, httpRes) {
        return await UserService.updatePublicKeyUser(httpReq, httpRes);
    }
}

export default new UserController();