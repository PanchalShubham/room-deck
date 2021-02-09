import React, {useState} from 'react';
// import 'emoji-mart/css/emoji-mart.css'
// import {Picker} from 'emoji-mart';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGrinAlt, faPaperPlane, faPaperclip, faTimes } from '@fortawesome/free-solid-svg-icons';
import './ChatInput.css';
import AttachmentManager from './AttachmentManager';

const ChatInput = (props)=>{

    const attachmentManager = new AttachmentManager();
    const displayAttachments = attachmentManager.displayAttachments;
    const [displayEmojiPicker, setDisplayEmojiPicker] = useState(false);

    // moves the cursor to the end of content editable div
    let setEndOfContenteditable = (contentEditableElement) => {
        var range,selection;
        if(document.createRange){
            range = document.createRange();//Create a range (a range is a like the selection but invisible)
            range.selectNodeContents(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            selection = window.getSelection();//get the selection object (allows you to change selection)
            selection.removeAllRanges();//remove any selections already made
            selection.addRange(range);//make the range you have just created the visible selection
        } else if(document.selection) { 
            range = document.body.createTextRange();//Create a range (a range is a like the selection but invisible)
            range.moveToElementText(contentEditableElement);//Select the entire contents of the element with the range
            range.collapse(false);//collapse the range to the end point. false means collapse to end rather than the start
            range.select();//Select the range (make it the visible selection
        }
    }


    // handles the emoji click event - adds emoji to text area
    const onEmojiClick = (emoji, event)=>{
        let div = document.getElementById('chatInput');
        let img = document.createElement('img');
        let style = event.target.getAttribute('style');
        img.setAttribute('style', style);
        div.appendChild(img);
        div.focus();
        setEndOfContenteditable(div);
    };


    // ENTER is SEND
    const onKeyPress = (event) => {
        // check if action has to be taken
        if (!event.shiftKey && event.key === 'Enter') {
            // get the content from local storage
            let enterIsSend = localStorage.getItem('enterIsSend');
            // check if enter is send enabled
            if (enterIsSend && enterIsSend === "false")   return;
            // send message
            props.sendMessage(event);
        }
    };

    // let emojiPickerItem = displayEmojiPicker && 
    //                         (<div className="emojiPickerContainer">
    //                                 <Picker set='google' showPreview={false} showSkinTones={false}
    //                                 onClick={onEmojiClick} />
    //                         </div>);
    return (
        <div className="chatInputOuterContainer row footer">
            <div className="chatInputInnerContainer">
                <div className="chatInputTextAreaContainer">
                    <div contentEditable="true" id="chatInput"
                        className="chatInputTextArea"
                        onKeyPress={onKeyPress}>
                    </div>
                </div>
                <div className="chatInputOptionsContainer">
                    <button onClick={event => setDisplayEmojiPicker(!displayEmojiPicker)}
                        className="emojiButton"><FontAwesomeIcon icon={displayEmojiPicker ? faTimes : faGrinAlt}/></button>
                    <button onClick={event => displayAttachments(props.sendAttachment)}><FontAwesomeIcon icon={faPaperclip}/></button>
                    <button onClick={event => props.sendMessage(event)}><FontAwesomeIcon icon={faPaperPlane}/></button>
                </div>
            </div>
            {/* {emojiPickerItem} */}
        </div>
    );
};
export default ChatInput;