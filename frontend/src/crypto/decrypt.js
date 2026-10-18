import util from "tweetnacl-util";


export async function decryptMessage(encryptedPayloade, sharedKeyBytes){
    try{
        const  {iv, ciphertext} = encryptedPayloade;

        const ivBytes = util.decodeBase64(iv);
        const cipherBytes = util.decodeBase64(ciphertext);

        const cryptoKey = await crypto.subtle.importKey(
            "raw",
            sharedKeyBytes,
            {name: "AES-GCM"},
            false,
            ["decrypt"]
        );

        const decryptBuffer = await crypto.subtle.decrypt(
            {
                name : "AES-GCM",
                iv: ivBytes
            },
            cryptoKey,
            cipherBytes
        );

        return new TextDecoder().decode(decryptBuffer);
    }catch(error){
        console.error("Decryption error (message altered or wrong key):", error);
    }
}