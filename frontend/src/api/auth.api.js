import api from "./api";





// add interseptor
class AuthApi {
    async createAccount(userdata) {
        try {
            return await api.post("/users/create-account", userdata);
        } catch (error) {
            throw error;
        }
    }
    async login(tokenUser, password) {
        try {
            return await api.post("/users/login", {tokenUser, password});
        } catch (error) {
            throw error;
        }
    }
    async refreshRecoveryText(tokenUser, password) {
        try {
            return await api.post("/users/refresh-recovery", { tokenUser, password });
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthApi();