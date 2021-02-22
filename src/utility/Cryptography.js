// necessary imports
import CryptoJS from 'crypto-js';

// performs an ecnryption on the text
export const encryptMessage = (key, messageObject) => {
    let bytes = CryptoJS.AES.encrypt(JSON.stringify(messageObject), key);
    let cipherText = bytes.toString();
    return cipherText;
};
// performs the decryption on the text
export const decryptMessage = (key, encryptedString)=>{
    let bytes = CryptoJS.AES.decrypt(encryptedString, key);
    let text = bytes.toString(CryptoJS.enc.Utf8);
    return JSON.parse(text);
};