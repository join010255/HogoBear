import * as SecureStore from "expo-secure-store";

class UserStore {
    async getData(key) {
        try{
            const userToken = await SecureStore.getItemAsync(key);
            if(userToken){
                return JSON.parse(userToken); 
            }
        }catch(error){
            console.error(error);
            
        }      
    }
    
    async setData(key, value){
        try{
            await SecureStore.setItemAsync(key, JSON.stringify(value));
            return true;
        }catch(error){
            console.error(error);
        }  
    } 

    async ramoveData(key){
        try{
            await SecureStore.deleteItemAsync(key);
            return true;
        }catch(error){
            console.error(error);
            return false;
        }  
    }
    
    async updateData(key, data){
        try{
            const existingDataString = await SecureStore.getItemAsync(key);
            let existingData = {};
            if (existingDataString) {
                existingData = JSON.parse(existingDataString);
                
            }
            const updatedData = { ...existingData, ...data };
            await SecureStore.setItemAsync(key, JSON.stringify(updatedData));
            return true;
        }catch(error){
            console.error(error);
            return false;
        }
    }
}
export default new UserStore();