import * as SecureStore from "expo-secure-store";

class UserStore {
    async getUser() {
        try{
            const userToken = await SecureStore.getItemAsync("userToken");
            if(userToken){
                return JSON.parse(userToken); 
            }
        }catch(error){
            console.error(error);
            
        }      
    }
    async setUser(token){
        try{
            await SecureStore.setItemAsync("userToken", JSON.stringify(token));
            return true;
        }catch(error){
            console.error(error);
        }  
    }   
    async removeUser(){
        try{
            await SecureStore.deleteItemAsync("userToken");
            return true;
        }catch(error){
            console.error(error);
            return false;
        }  
    }   
}
export const userStore = new UserStore();