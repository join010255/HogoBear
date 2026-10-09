import nacl from 'tweetnacl';
import util from 'tweetnacl-util';
import UserStore from '../store/userStore';
import { useAuthStore } from '../store/authStore';

class Keys {
    generateX25519Keys = async () => {
        const keyPair = nacl.box.keyPair();
        const yourPrivateKeyBase = util.encodeBase64(keyPair.secretKey);
        const yourPublicKeyBase = util.encodeBase64(keyPair.publicKey);
        
        // Save in Zustand
        useAuthStore.getState().setKeys(yourPublicKeyBase, yourPrivateKeyBase);

        return {
            publicKey: yourPublicKeyBase,
        };
    };

    exchangeKeys = async (friendPublicKey) => {
        try {
            const friendPublicKeyBytes = util.decodeBase64(friendPublicKey);
            
            let yourPrivateKey = useAuthStore.getState().privateKey;
            
            if (!yourPrivateKey) {
                
                useAuthStore.getState().setKeys(useAuthStore.getState().publicKey, yourPrivateKey);
               
            }
            if (yourPrivateKey) {
                const yourPrivateKeyBytes = util.decodeBase64(yourPrivateKey);    
                
                const rawSharedPoint = nacl.scalarMult(
                    yourPrivateKeyBytes,
                    friendPublicKeyBytes
                );
                
                // Hash the shared point to derive a 32-byte AES key (using SHA-512 truncated to 32 bytes)
                const aesKey32 = nacl.hash(rawSharedPoint).slice(0, 32);
                return aesKey32;
            } else {
                throw new Error("Private key not found in storage");
            }
        } catch (error) {
            console.error("Key exchange error:", error);
            throw error;
        }
    }
}

export default new Keys();