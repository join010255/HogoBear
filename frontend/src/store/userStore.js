import * as SecureStore from "expo-secure-store";

class UserStore {
    async getData() {
        try{
            const userToken = await SecureStore.getItemAsync("userToken");
            if(userToken){
                return JSON.parse(userToken); 
            }
        }catch(error){
            console.error(error);
            
        }      
    }
    
    async setData(token){
        try{
            await SecureStore.setItemAsync("userToken", JSON.stringify(token));
            return true;
        }catch(error){
            console.error(error);
        }  
    } 

    async ramoveData(){
        try{
            await SecureStore.deleteItemAsync("userToken");
            return true;
        }catch(error){
            console.error(error);
            return false;
        }  
    }   
}
export default new UserStore();