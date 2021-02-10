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
    ENDPOINT : `http://localhost:8080`,
    MAX_RECONNECTION_ATTEMPTS : 5,
    CONNECT : 'connect',
    IP_ERROR : 'ip-error',
    CREATE_OR_JOIN : 'create-or-join',
    CREATE_ROOM_SUCCESS : 'create-room-success',
    FOUND_RUNNING_ROOM_SESSION : 'found-running-room-session',
    NO_SUCH_ROOM_ERROR : 'no-such-room-error',
    JOINED_VIA_ANOTHER_WINDOW : 'joined-via-another-window',
    JOIN_ROOM_SUCCESS : 'join-room-success',
    JOINED_ROOM : 'joined-room',
    LEFT_ROOM : 'left-room',
    MESSAGE_ALL : 'message-all',
    EXIT_FROM_ROOM : 'exit-from-room',
    TERMINATE_ROOM : 'terminate-room',
    ROOM_TIME_OUT : 'room-time-out',
};
