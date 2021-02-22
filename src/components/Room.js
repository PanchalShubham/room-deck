import React, { useContext, useEffect, useRef} from 'react';
import ChatInput from './ChatInput';
import InfoBar from './InforBar';
import '../styles/Room.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import ChatContext from '../context/ChatContext';
import Message from './Message';

// define the functional component
const Room = (props)=>{
    // used to scroll to bottom once updated!
    const mounted = useRef();
    useEffect(()=>{
        if (!mounted.current) {
            mounted.current = true;
        } else {
            // get the container and scroll it to bottom
            let div = document.getElementById(`messagesContainer`);
            if (!div)   return;
            div.scrollTop = div.scrollHeight;            
        }
    });

    // get the properties in the context
    const {
        messageList,
        taggedMessage, setTaggedMessage
    } = useContext(ChatContext);




    // render the component
    return (
        <div className="roomOuterContainer">
            <div className="roomInnerContainer">
                <InfoBar />
                <div className="messagesOuterContainer" id="messagesContainer">
                    {messageList.map(message => (
                            <Message message={message} key={message.id}/>
                    ))}
                </div>
                {taggedMessage && 
                    <div 
                        className="taggedMessage"
                        onClick={()=> {
                            let item = document.getElementById(taggedMessage.id);
                            if (item)   item.scrollIntoView();
                        }}>
                        <div className="messageBody">
                            <div className="author">{taggedMessage.username}</div>
                            <div>{taggedMessage.caption || taggedMessage.content}</div>
                        </div>
                        <div>
                            <button onClick={() => setTaggedMessage(null)}>
                                <FontAwesomeIcon icon={faTimes} />
                            </button>
                        </div>
                    </div>
                }
                <ChatInput />
            </div>
        </div>
    );
};
export default Room;