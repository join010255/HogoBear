import { create } from "zustand";

export const createAccountStore = create((set) => ({
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

export const useAuthStore = create((set) => ({
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

    setConversations: (conversations) => set({ conversations }),

    updateUserPresence: (userId, isOnline) => set((state) => ({
        conversations: (state.conversations || []).map((conv) => {
            const isUserOne = conv.userOne?.id === userId;
            const isUserTwo = conv.userTwo?.id === userId;
            if (isUserOne || isUserTwo) {
                return {
                    ...conv,
                    userOne: isUserOne ? { ...conv.userOne, is_online: isOnline } : conv.userOne,
                    userTwo: isUserTwo ? { ...conv.userTwo, is_online: isOnline } : conv.userTwo,
                };
            }
            return conv;
        }),
    })),

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
