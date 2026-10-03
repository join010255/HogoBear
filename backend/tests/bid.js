import { webcrypto } from "node:crypto";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

if (!globalThis.crypto) {
    Object.defineProperty(globalThis, "crypto", {
        value: webcrypto
    });
}

function generateMnemonicWrapper() {
    return generateMnemonic(wordlist, 128);
}
export default generateMnemonicWrapper;