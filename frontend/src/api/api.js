import axios from "axios";
import UserStore from "../store/userStore.js";
import { API_URL } from "../constants/config.js";

const api = axios.create({
    baseURL: API_URL
});

api.interceptors.request.use(
    async (config) => {
        const token = await UserStore.getData("userToken");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;