import { webcrypto } from "node:crypto";
import { generateMnemonic } from "@scure/bip39";
import { wordlist } from "@scure/bip39/wordlists/english.js";

globalThis.crypto = webcrypto;

function generateMnemonicc() {
    return generateMnemonic(wordlist, 128);
}




export default generateMnemonic;