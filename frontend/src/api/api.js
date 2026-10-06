import axios from "axios";
import UserStore from "../store/userStore.js";

const api = axios.create({
    baseURL: "http://192.168.1.217:3000/api"
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