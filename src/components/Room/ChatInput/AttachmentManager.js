import React from 'react';
// import toaster from 'toasted-notes';
// import 'toasted-notes/src/styles.css';
import './AttachmentManager.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faImage, faFileAudio, faVideo, faFile } from '@fortawesome/free-solid-svg-icons';
// import ToasterNotification from '../../../toasterNotification';

const AttachmentModal = ({onClose, sendAttachment})=>{

    // stores the type of attachment
    let attachmentType = null;

    // accepts the input - fires click event on file input
    const acceptFileInput = (event, type)=>{
        event.preventDefault();
        attachmentType = type;
        let input = document.getElementById('fileInput');
        if (!input) return;
        if (type === 'image')       input.setAttribute('accept', `image/*`);
        else if (type === 'audio')  input.setAttribute('accept', `audio/*`);
        else if (type === 'video')  input.setAttribute('accept', `video/*`);
        else                        input.setAttribute('accept', `file/*`);
        if (input)  input.click();
    };

    // reads the file
    const onFileInputChange = (event)=>{

        // get the selected file
        if (!event.target.files) {
            // ToasterNotification.notify(false, `Your browser doesn't support this type of files!`);
            return;
        }
        let file = event.target.files[0];
        // console.log(file);
        if (!file)  return;
        if (file.size / (1024 * 1024) > 10) {
            // ToasterNotification.notify(false, 'File size greater than 10MB');
            return;
        }

        let button = document.getElementById('closeAttachmentModalButton');
        if (button) button.click();
        // toaster.notify(({ onClose }) => {
        //     return (
        //         <div className="promptContainer">
        //             Uploading your file...
        //         </div>
        //     );
        // }, {
        //     position: "top",
        //     duration: 2000
        // });    
        const reader = new FileReader();
        reader.addEventListener('load', loadEvent => {
            const result = loadEvent.target.result;
            let attachment = null;
            if (attachmentType === 'image') {
                attachment = `<img src='${result}' class='attachment'>`;
            } else if (attachmentType === 'audio') {
                attachment = `<audio controls class='attachment'><source src='${result}'>You browser does not support audios!</audio>`;
            } else if (attachmentType === 'video') {
                attachment = `<video controls class='attachment'><source src='${result}'>Your browser does not support videos!</video>`;
            } else {
                attachment = `<a href='${result}' download style='background: rgb(245,245,245); padding: 5px; border-radius: 10px; font-weight: bolder;'>${file.name} (${Math.round(file.size / 1024)} KB)</a>`;
            }
            attachmentType = null;
            sendAttachment(attachment);
        });
        // read the file
        reader.readAsDataURL(file);
    };

    return (
        <div className="promptContainer">
            <div className="attachmentModalContainer">
                <input type="file" hidden id="fileInput"
                    onChange={onFileInputChange}/>
                <div className="closeAttachmentModal">
                    <button onClick={onClose} className="attachmentButton"
                        id='closeAttachmentModalButton'>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                    <div className="attachmentButtonContainer">
                        Max File Size: 10MB <br/>
                        <hr/>
                        <button id="imageAttachmentButton" className="attachmentButton"
                            onClick={event => acceptFileInput(event, 'image')}>
                            <FontAwesomeIcon icon={faImage}/>
                            <span id="imageAttachmentText">Select an Image</span>
                        </button>
                        <hr/>
                        <button id="audioAttachmentButton" className="attachmentButton"
                            onClick={event => acceptFileInput(event, 'audio')}>
                            <FontAwesomeIcon icon={faFileAudio}/>
                            <span id="audioAttachmentText">Select an audio</span>
                        </button>
                        <hr/>
                        <button id="videoAttachmentButton" className="attachmentButton"
                            onClick={event => acceptFileInput(event, 'video')}>
                            <FontAwesomeIcon icon={faVideo}/>
                            <span id="videoAttachmentText">Select a video</span>
                        </button>
                        <hr/>
                        <button id="documentAttachmentButton" className="attachmentButton"
                            onClick={event => acceptFileInput(event, 'document')}>
                            <FontAwesomeIcon icon={faFile}/>
                            <span id="documentAttachmentText">Select a document</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};


class AttachmentManager{

    displayAttachments = (sendAttachment)=>{
        // toaster.notify(({ onClose }) => {
        //     return (
        //         <AttachmentModal onClose={onClose} sendAttachment={sendAttachment}/>
        //     );
        // }, {
        //     position: "top",
        //     duration: null
        // });    
    };
};
export default AttachmentManager;