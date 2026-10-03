import * as SecureStore from "expo-secure-store";

export const saveSecret = (key, value) => SecureStore.setItemAsync(key, value);
export const readSecret = (key) => SecureStore.getItemAsync(key);
export const deleteSecret = (key) => SecureStore.deleteItemAsync(key);