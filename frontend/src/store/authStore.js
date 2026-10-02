import * as zustand from "zustand";


const createAccountStore = zustand.create((set) => ({
    username: "",
    password : "",
    tokenUser: "",
    recovery_accout_text: "",

    setAuthData: (newUsername, newPassword) => set({
        username : newUsername,
        password: newPassword
    }),

    setAccountDetails: (data) => set({
        tokenUser: data.tokenUser,
        recovery_accout_text: data.recovery_accout_text,
        username: data.username
    }),

    clearAuthData: () => set({
        username: "",
        password: "",
        tokenUser: "",
        recovery_accout_text: ""
    })
}));

export default createAccountStore;