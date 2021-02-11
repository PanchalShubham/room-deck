import React, { useContext, useState } from 'react';
import Picker, { SKIN_TONE_LIGHT} from "emoji-picker-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileAudio, faFileImage, faFileVideo, 
        faPaperclip, faPaperPlane, faSmile, faTimes} from '@fortawesome/free-solid-svg-icons';
import '../styles/ChatInput.scss';
import ChatContext from '../context/ChatContext';
import {addToast} from '../utility/ToastedNotes';
import {showModal, closeModal} from '../utility/Modal';
import DownloadIcon from '../assets/download.png';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

// functional component
export default function ChatInput(props){    
    const {
        sendMessage,
        MESSAGE_TYPE,
    } = useContext(ChatContext);
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);
    const onEmojiClick = (event, emojiObject) => {
        setText(text + emojiObject.emoji);
        focusInput();
    };
    const focusInput = () => {
        document.getElementById('chat-input').focus();
        document.execCommand('selectAll', false, null);
        document.getSelection().collapseToEnd();
    };
    const inputHandler = (event) => {
        event.preventDefault();
        setText(event.target.innerText);
        focusInput();
    };
    const prepareAndSendMessage = (content, type, filename = null, caption = null) => {
		// prepare the message
        let item = {content, type, filename, caption};
        // send the message
        sendMessage(item);
    };
    const dispatchMessage = () => {
        let userText = String(text).trim();
        if (userText === '') return;
        setShowEmojiPicker(false);
        setText('');
        prepareAndSendMessage(userText, MESSAGE_TYPE.TEXT);
    };
    const keyDownHandler = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            dispatchMessage();
        }
    };

    const prepareMessage = (type, content, filename) => {
        let item = null;
        if (type === MESSAGE_TYPE.FILE){
            item = <a href={content} className="fileAttachment" 
                        download={filename}>
                        <img src={DownloadIcon} alt=""/> {filename}
                    </a>
        } else if (type === MESSAGE_TYPE.IMAGE) {
            item = <img src={content} alt="" />
        } else if (type === MESSAGE_TYPE.AUDIO) {
            item = <AudioPlayer controls src={content} />
        } else if (type === MESSAGE_TYPE.VIDEO) {
            item = <video controls src={content} />
        }
        return (
            <div>
                {item}
                <div className="caption">
                    <input type="text" id="caption" autoComplete="off"
                        placeholder="Type a caption..." onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                let button = document.getElementById(`sendAttachment`);
                                if (button) button.click();
                            }                    
                        }} />
                    <button id="sendAttachment" onClick={()=> {
                        closeModal();
                        let captionInput = document.getElementById('caption');
                        let caption = null;
                        if (captionInput)   caption = captionInput.value;
                        prepareAndSendMessage(content, type, filename, caption);
                    }}>
                        <FontAwesomeIcon icon={faPaperPlane} /> Send
                    </button>
                </div>
            </div>
        );
    }

    const pickAttachment = (type) => {
        // prepare the input
        let input = document.createElement('input');
        let accept = null;
        if      (type === MESSAGE_TYPE.AUDIO) accept = "audio/*";
        else if (type === MESSAGE_TYPE.VIDEO) accept = "video/*";
        else if (type === MESSAGE_TYPE.IMAGE) accept = "image/*";
        input.setAttribute('type', 'file');
        if (accept) input.setAttribute('accept', accept);
        input.addEventListener('change', () => {
            if (input.files && input.files.length === 1) {
                let file = input.files[0];
                let _size = file.size;
                if (_size > MESSAGE_TYPE.MAX_FILE_SIZE) 
                    return addToast(`Max. file size size is ${MESSAGE_TYPE.MAX_FILE_SIZE_STRING}`, {appearance: 'error'});
                setShowAttachment(false);
                let reader = new FileReader();
                reader.onload = (event) => {
                    let {result} = event.target;
                    let itemToDisplay = prepareMessage(type, result, file.name);
                    showModal(itemToDisplay);
                    let captionInput = document.getElementById('caption');
                    if (captionInput)   captionInput.focus();
                };
                reader.readAsDataURL(file);
            }
        });
        // read the input
        input.click();
    };

    return (
        <div className="chat-input">
            <div className="fields">
                <button onClick={() => setShowEmojiPicker(!showEmojiPicker)}>
                    <FontAwesomeIcon icon={showEmojiPicker ? faTimes : faSmile} />
                </button>
                <div>
                    {showAttachment &&
                    <div className="attachmentButtons">
                        <button className="fileButton" onClick={() => pickAttachment(MESSAGE_TYPE.FILE)}>
                            <FontAwesomeIcon icon={faFileAlt} />
                        </button>
                        <button className="videoButton" onClick={() => pickAttachment(MESSAGE_TYPE.VIDEO)}>
                            <FontAwesomeIcon icon={faFileVideo} />
                        </button>
                        <button className="audioButton" onClick={() => pickAttachment(MESSAGE_TYPE.AUDIO)}>
                            <FontAwesomeIcon icon={faFileAudio} />
                        </button>
                        <button className="imageButton" onClick={() => pickAttachment(MESSAGE_TYPE.IMAGE)}>
                            <FontAwesomeIcon icon={faFileImage} />
                        </button>
                    </div>}
                    <button onClick={() => setShowAttachment(!showAttachment)}>
                        <FontAwesomeIcon icon={showAttachment ? faTimes : faPaperclip} />
                    </button>
                </div>
                <div className="chatInputContainer">
                    <div 
                        contentEditable 
                        id="chat-input"
                        dangerouslySetInnerHTML={{__html: text}}                    
                        onInput={inputHandler}
                        onPaste={event => event.preventDefault()}
                        onKeyDown={keyDownHandler}
                    ></div>
                </div>
                <button onClick={dispatchMessage}>
                    <FontAwesomeIcon icon={faPaperPlane} />
                </button>
            </div>
            {showEmojiPicker && 
            <div className="emoji-container">
                <Picker 
                    onEmojiClick={onEmojiClick}
                    skinTone={SKIN_TONE_LIGHT}
                    disableAutoFocus={true}
                    native={true}
                />
            </div>}
        </div>
    );
};