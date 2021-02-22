import React, { useContext, useState } from 'react';
import '../styles/Message.scss';
import DownloadIcon from '../assets/download.png';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faChevronDown, faChevronUp} from '@fortawesome/free-solid-svg-icons';
import * as MESSAGE_TYPE from '../utility/MessageType';
import ChatContext from '../context/ChatContext';


const messageToComponent = (message) => {
    let {type, content, filename, caption} = message;
    if (type === MESSAGE_TYPE.TEXT)    return content;
    if (type === MESSAGE_TYPE.IMAGE) {
        return (
            <div>
                <img src={content} alt="" />
                <div>{caption}</div>                
            </div>
        );
    }
    if (type === MESSAGE_TYPE.VIDEO) {
        return (
            <div>
                <video controls src={content} />
                <div>{caption}</div>                
            </div>
        );
    }
    if (type === MESSAGE_TYPE.AUDIO) {
        return (
            <div>
                <AudioPlayer controls src={content} />
                <div>{caption}</div>                
            </div>
        );
    }
    if (type === MESSAGE_TYPE.FILE) {
        return (
            <div>
                <a href={content} className="fileAttachment" 
                    download={filename}>
                    <img src={DownloadIcon} alt=""/> {filename}
                </a>
                <div>{caption}</div>                
            </div>
        );
    }
    return null;
};

// actual functional component
export default function Message(props){
    let {setTaggedMessage, deleteMessageById} = useContext(ChatContext);
    let {message} = props;    
    let {admin, amIAuthor, taggedMessage} = message;
    const [xDown, setXDown] = useState(null);
    const [yDown, setYDown] = useState(null);
    const [showMenu, setShowMenu] = useState(false);
    if (admin) {
        return (
            <div className="message-container" id={message.id}>
                <div className="adminMessageContainer">
                    <div className="adminMessage">
                        {message.content}
                    </div>
                </div>
            </div>
        );
    }

    const handleTouchStart = (event) => {
        setXDown(event.touches[0].clientX);
        setYDown(event.touches[0].clientY);
    };
    const handleTouchMove = (event) => {
        let xUp = event.touches[0].clientX;
        let yUp = event.touches[0].clientY;
        let xDiff = xDown - xUp;
        let yDiff = yDown - yUp;
        if (Math.abs(xDiff) > Math.abs(yDiff)) {
            if (xDiff > 0) {
                // swipped left!
            }
        }
        setXDown(null);
        setYDown(null);
    };

    let classList = ['message-container'];
    classList.push(amIAuthor ? 'self-message' : 'other-message');
    return (
        <div
            onClick={()=> setTaggedMessage(message)}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            id={message.id} 
            className={classList.join(' ')}>
            <div className="message">
                <div className={`arrow-container ${amIAuthor ? 'right-align' : 'left-align'}`}> 
                    {amIAuthor ? 
                        <div className="arrow right-arrow"></div>:
                        <div className="arrow left-arrow"></div>
                    }
                </div>
                <div className={`message-body ${amIAuthor ? 'self' : 'other'}`}>
                    <div className="author">
                        <div>
                            {message.username}
                            <span>{message.timeStamp}</span>
                        </div>
                        <div className="messageOperation">
                            <button onClick={(event) => {
                                event.stopPropagation();
                                setShowMenu(!showMenu);
                            }}>
                                <FontAwesomeIcon icon={showMenu ? faChevronUp: faChevronDown} />
                            </button>
                            {showMenu && 
                            <div className="messageMenu"
                                onClick={(event) => {event.stopPropagation()}}>
                                <div onClick={() => setTaggedMessage(message)}>Reply</div>
                                <div onClick={() => deleteMessageById(message.id)}>Delete</div>
                            </div>}
                        </div>                        
                    </div>
                    {taggedMessage && 
                    <div 
                        className="taggedMessage"
                        onClick={(event)=> {
                            event.stopPropagation();
                            let item = document.getElementById(taggedMessage.id);
                            if (item)   item.scrollIntoView();
                        }}>
                        <div className="messageBody">
                            <div className="author">{taggedMessage.username}</div>
                            <div>{taggedMessage.caption || taggedMessage.content}</div>
                        </div>
                    </div>}
                    {messageToComponent(message)}
                </div>
            </div>
        </div>
    );
};