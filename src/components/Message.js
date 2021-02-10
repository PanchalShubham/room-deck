import React from 'react';
import '../styles/Message.scss';
import {MESSAGE_TYPE} from '../utility/DataAccessObject';
import DownloadIcon from '../assets/download.png';
const messageToComponent = (message) => {
    let {type, content, filename, caption} = message;
    if (type === MESSAGE_TYPE.TEXT)    return content;
    if (type === MESSAGE_TYPE.IMAGE) {
        return (
            <div>
                <img src={content} alt="" />
                {caption}
            </div>
        );
    }
    if (type === MESSAGE_TYPE.VIDEO) {
        return (
            <div>
                <video controls src={content} />
                {caption}
            </div>
        );
    }
    if (type === MESSAGE_TYPE.AUDIO) {
        return (
            <div>
                <audio controls src={content} />
                {caption}
            </div>
        );
    }
    if (type === MESSAGE_TYPE.FILE) {
        return (
            <div>
                <a href={content} className="fileAttachment" 
                    download={filename}>
                    <img src={DownloadIcon} alt=""/> {filename}</a>
            </div>
        );
    }
    return null;
};

// actual functional component
export default function Message(props){
    let {message} = props;
    let {admin, amIAuthor} = message;
    if (admin) {
        return (
            <div className="message-container">
                <div className="adminMessageContainer">
                    <div className="adminMessage">
                        {message.content}
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className={`message-container ${amIAuthor ? 'self-message' : 'other-message'}`}>
            <div className="message">
                <div className={`arrow-container ${amIAuthor ? 'right-align' : 'left-align'}`}> 
                    {amIAuthor ? 
                        <div className="arrow right-arrow"></div>:
                        <div className="arrow left-arrow"></div>
                    }
                </div>
                <div className={`message-body ${amIAuthor ? 'self' : 'other'}`}>
                    <div className="author">
                        {message.username}
                        <span>{message.timeStamp}</span>
                    </div>
                    {messageToComponent(message)}
                </div>
            </div>
        </div>
    );
};