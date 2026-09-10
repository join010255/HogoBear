import { generateMnemonic } from '@scure/bip39';
import { wordlist } from "@scure/bip39/wordlists/english.js";

function generateMnemonic(){
    const mnemonic = generateMnemonic(wordlist, 128);
    return mnemonic;
}

// console.log(generateMnemonic())

export default generateMnemonic;