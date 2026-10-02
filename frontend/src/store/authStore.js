import * as zustand from "zustand";


const createAccountStore = zustand.create((set) => ({
    isCreatingAccount: false,
    setIscreatingAccount: () => set({isCreatingAccount: true})
}));

export default createAccountStore;