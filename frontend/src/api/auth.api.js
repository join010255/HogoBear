import api from "./api";



class AuthApi {
    async createAccount(userdata) {
        try {
            return await api.post("/users/create-account", userdata);
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