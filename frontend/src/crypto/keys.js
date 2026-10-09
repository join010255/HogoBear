import sodium from 'libsodium-wrappers';
import UserStore from '../store/userStore';


class Keys{
    generateX25519Keys = async () => {
        await sodium.ready;

        const keyPair = sodium.crypto_box_keypair();

        return {

            publicKey: sodium.to_base64(keyPair.publicKey),

            privateKey: sodium.to_base64(keyPair.privateKey)
        };
    };

    exchageKeys = async (friendPublicKey) => {
        try{
            await sodium.ready

            const friendPublicKeyBytes = sodium.from_base64(friendPublicKey)
            
            if(await UserStore.getData('privateKey')){
                
            }
            const youPrivatKey = sodium.from_base64()

        }  
    }
}


generateX25519Keys().then(keys => console.log(keys)).catch(console.error);