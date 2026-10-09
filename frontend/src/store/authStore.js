import * as zustand from "zustand";


export const createAccountStore = zustand.create((set) => ({
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

export const useAuthStore = zustand.create((set) => ({
    user: null,
    conversations: [],
    friends: [],

    publicKey: null,
    privateKey: null,

    setVerifyData: (data) => set({
        user: data.user || null,
        conversations: data.conversations || [],
        friends: data.friends || []
    }),

    setKeys: (publicKey, privateKey) => set({
        publicKey,
        privateKey
    }),

    clearVerifyData: () => set({
        user: null,
        conversations: [],
        friends: [],
        publicKey: null,
        privateKey: null
    })
}));
