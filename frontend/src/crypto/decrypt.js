import forge from "node-forge";

// Decrypts payload using AES-256-GCM and verifies authenticity
export async function decryptMessage(encryptedPayload, sharedKeyBytes) {
  try {
    if (!encryptedPayload || !sharedKeyBytes) return null;

    
    console.log(encryptedPayload.nonce)
    const ivB64 = encryptedPayload.iv || encryptedPayload.nonce;
    const ciphertextB64 = encryptedPayload.ciphertext;
    const tagB64 = encryptedPayload.tag;

    if (!ivB64 || !ciphertextB64) {
      return typeof encryptedPayload === "string" ? encryptedPayload : "";
    }

    const keyBinary = forge.util.binary.raw.encode(sharedKeyBytes);
    const ivBinary = forge.util.decode64(ivB64);
    let cipherBinary = forge.util.decode64(ciphertextB64);
    let tagBinary = tagB64 ? forge.util.decode64(tagB64) : null;

    // Support combined ciphertext + tag if tag wasn't passed separately
    if (!tagBinary && cipherBinary.length > 16) {
      tagBinary = cipherBinary.slice(-16);
      cipherBinary = cipherBinary.slice(0, -16);
    }

    const decipher = forge.cipher.createDecipher("AES-GCM", keyBinary);
    decipher.start({
      iv: ivBinary,
      tagLength: 128,
      tag: tagBinary ? forge.util.createBuffer(tagBinary) : undefined,
    });
    decipher.update(forge.util.createBuffer(cipherBinary));

    const pass = decipher.finish();
    if (!pass) {
      console.error("Decryption failed: Authentication tag mismatch or corrupted data");
      return "[⚠️ Could not decrypt message]";
    }

    return decipher.output.toString("utf8");
  } catch (error) {
    console.error("Decryption error (AES-GCM):", error);
    return "[⚠️ Decryption error]";
  }
}

export default decryptMessage;