import forge from "node-forge";

// Encrypts plainText using AES-256-GCM (Authenticated Encryption with 128-bit Auth Tag)
export async function encryptionMess(plainText, sharedKeyBytes) {
  try {
    if (!sharedKeyBytes) {
      throw new Error("Shared key is missing");
    }

    // 1. Convert sharedKeyBytes (Uint8Array 32 bytes) to binary string
    const keyBinary = forge.util.binary.raw.encode(sharedKeyBytes);

    // 2. Generate random 12-byte IV for AES-GCM
    const ivBytes = crypto.getRandomValues(new Uint8Array(12));
    const ivBinary = forge.util.binary.raw.encode(ivBytes);

    // 3. Initialize AES-GCM Cipher
    const cipher = forge.cipher.createCipher("AES-GCM", keyBinary);
    cipher.start({
      iv: ivBinary,
      tagLength: 128, // 16 bytes auth tag
    });
    cipher.update(forge.util.createBuffer(plainText, "utf8"));
    cipher.finish();

    const ciphertextBinary = cipher.output.getBytes();
    const tagBinary = cipher.mode.tag.getBytes();

    return {
      ciphertext: forge.util.encode64(ciphertextBinary),
      iv: forge.util.encode64(ivBinary),
      tag: forge.util.encode64(tagBinary),
      nonce: forge.util.encode64(ivBinary), // alias for compatibility
    };
  } catch (error) {
    console.error("Encryption error (AES-GCM):", error);
    throw error;
  }
}

export const encryptMessage = encryptionMess;
export default encryptionMess;
