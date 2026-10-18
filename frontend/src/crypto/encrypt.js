import util from "tweetnacl-util";


// this function encrypt message and return cipher text
export async function encryptionMess(plainText, sharedKeyBytes) {
    try {
        const iv = crypto.getRandomValues(new Uint8Array(12));

        //x0774455
        const cryptoKey = await crypto.subtle.importKey(
            "raw", // key format
            sharedKeyBytes, // key data 8arry bytes
            {name: "AES-GCM"}, // Algorithm
            false, // not extract key from memory 
            ["encrypt"] // method
        );

        const encodedText = new TextEncoder().encode(plainText);
        const cipherBuffer = await crypto.subtle.encrypt(
            {
                name: "AES-GCM",
                iv: iv
            },
            cryptoKey,
            encodedText
        );

        return {
            iv: util.encodeBase64(iv),
            ciphertext: util.encodeBase64(new Uint8Array(cipherBuffer)),
        }
    } catch (error) {
        console.error("Encryption error:", error);
    }
}
