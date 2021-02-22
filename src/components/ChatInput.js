import React, { useContext, useState } from 'react';
import Picker, { SKIN_TONE_LIGHT} from "emoji-picker-react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faFileAlt, faFileAudio, faFileImage, faFileVideo, 
        faPaperclip, faPaperPlane, faSmile, faTimes} from '@fortawesome/free-solid-svg-icons';
import '../styles/ChatInput.scss';
import ChatContext from '../context/ChatContext';
import {addToast} from '../utility/ToastedNotes';
import {showModal, closeModal} from '../utility/Modal';
import Attachment from './Attachment';

// functional component
export default function ChatInput(props){    
    const {
        sendMessage,
        sendFileInChunks,
        MESSAGE_TYPE,
        setLoadingMessage,
    } = useContext(ChatContext);
    const [text, setText] = useState('');
    const [showEmojiPicker, setShowEmojiPicker] = useState(false);
    const [showAttachment, setShowAttachment] = useState(false);

    // utility functions
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
    const dispatchMessage = () => {
        let userText = String(text).trim();
        if (userText === '') return;
        setShowEmojiPicker(false);
        setText('');
        // send the message
        sendMessage({content: userText, type: MESSAGE_TYPE.TEXT});
    };
    const keyDownHandler = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault();
            dispatchMessage();
        }
    };

    const previewAttachment = (type, content, file) => {
        return (
            <div className="attachment-preview-container">
                <Attachment type={type} content={content} file={file} />
                <div className="caption">
                    <input type="text" id="caption" autoComplete="off"
                        placeholder="Type a caption..." onKeyDown={event => {
                            if (event.key === 'Enter') {
                                event.preventDefault();
                                let button = document.getElementById(`sendAttachment`);
                                if (button) button.click();
                            }                    
                        }} />
                    <button id="sendAttachment" onClick={() => {
                        closeModal();
                        let captionInput = document.getElementById('caption');
                        let caption = null;
                        if (captionInput)   caption = captionInput.value;
                        sendFileInChunks(type, content, file.name, caption);
                        // setTimeout(sendFileInChunks, 1000, type, file, caption);
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
        // add change listener to input
        input.addEventListener('change', () => {
            // check if input files are provided
            if (input.files && input.files.length === 1) {
                // make checks on file size
                let file = input.files[0];
                let _size = file.size;
                setShowAttachment(false);
                if (_size > MESSAGE_TYPE.MAX_FILE_SIZE)
                    return addToast(`Max. file size size is ${MESSAGE_TYPE.MAX_FILE_SIZE_STRING}`, {appearance: 'error'});
                let reader = new FileReader();
                // when file is loaded process the content
                reader.onload = (event) => {
                    let {result} = event.target;
                    let itemToDisplay = previewAttachment(type, result, file);
                    showModal(itemToDisplay);
                    let captionInput = document.getElementById('caption');
                    if (captionInput)   captionInput.focus();
                    setLoadingMessage(``);
                };
                // as file reading progress - inform the user
                reader.onprogress = (data) => {
                    if (data.lengthComputable) {
                        let progress = parseInt(((data.loaded / data.total) * 100), 10);
                        setLoadingMessage(`Please wait! I'm uploading your file (${progress}%)`)
                    }
                }
                // read the file for preview
                reader.readAsDataURL(file);
            }
        });
        // read the input
        input.click();
    };

    return (
        <div className="chat-input">
            <div className="fields">
                <button onClick={() => {
                    setShowAttachment(false);
                    setShowEmojiPicker(!showEmojiPicker);                    
                }}>
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
                    <button onClick={() => {
                        setShowEmojiPicker(false);
                        setShowAttachment(!showAttachment);
                    }}>
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