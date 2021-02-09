// necessary imports
import CryptoJS from 'crypto-js';

// performs an ecnryption on the text
export const encryptMessage = (key, messageObject) => {
    let bytes = CryptoJS.AES.encrypt(JSON.stringify(messageObject), key);
    let cipherText = bytes.toString();
    return cipherText;
};
// performs the decryption on the text
export const decryptMessage = (key, messageObject)=>{
    let bytes = CryptoJS.AES.decrypt(JSON.stringify(messageObject), key);
    let text = bytes.toString(CryptoJS.enc.Utf8);
    return text;
};

// constants for message-type
export const MESSAGE_TYPE = {
    MAX_FILE_SIZE: 10*1000000,
    MAX_FILE_SIZE_STRING : '10mb',
    TEXT : 'text',
    AUDIO : 'audio',
    VIDEO : 'video',
    IMAGE: 'image',
    FILE : 'file'
};

// configuration
export const CONFIG = {
    ENDPOINT : `http://localhost:8080`
};
