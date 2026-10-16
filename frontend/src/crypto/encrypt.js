import util from "tweetnacl-util";


export function encryptionMess(plainText){
    try{
        const iv = crypto.getRandomValues(new Uint8Array(12));

        const encodedText = new TextEncoder().encode(plainText);
    }
}