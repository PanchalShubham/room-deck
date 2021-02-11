import React, { useContext, useEffect, useRef} from 'react';
import ChatInput from './ChatInput';
import '../styles/Room.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faEllipsisH, faCheck, faUserAlt} from '@fortawesome/free-solid-svg-icons';
import ChatContext from '../context/ChatContext';
import Message from './Message';
import { addToast, removeToast } from '../utility/ToastedNotes';
import { v4 as uuidv4 } from 'uuid';


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
        room, 
        messageList,
        userId,
        exitFromRoom,
        toastList, setToastList,
    } = useContext(ChatContext);

    // prompts the user for exit operation
    const promptExit = () => {
        let amIOwner = (userId === room.adminId);
        let toastId = uuidv4();
        let item = (
            <div className="confirmation-dialog">
                <div>Are you sure you want to exit?</div>
                {amIOwner && 
                <div>
                    You are the owner of this room 
                    if you leave then everybody will be disconnected!
                </div>}
                <div className="confirmation-button">
                    <button className="danger" onClick={()=>{
                        // remove the popup
                        removeToast(toastId);
                        // exit from room
                        exitFromRoom();
                    }}><FontAwesomeIcon icon={faCheck} />Exit</button>
                    <button className="light" onClick={() => removeToast(toastId)}><FontAwesomeIcon icon={faTimes} />Cancel</button>
                </div>
            </div>
        );
        addToast(item, {appearance: 'none', position: 'center', toastId});
        setToastList([...toastList, toastId]);
    };
    // displays more details about the meeting
    const showMeetingDetails = () => {
        let toastId = uuidv4();
        let item = (
            <div className="meeting-details">
                <div className="close-details">
                    <button onClick={() => removeToast(toastId)}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>
                <div className="header">
                    <strong>RoomId: </strong> {room.roomId}
                </div>
                <div className="members">
                    {room.people.map(item => (
                        <div key={item.userId}>
                            <FontAwesomeIcon icon={faUserAlt} /> 
                            {item.username} 
                            {item.userId === userId && <span className="you-badge">You</span>} 
                            {item.userId === room.adminId && <span className="admin-badge">Admin</span>}<br/>
                            ({item.userId}) 
                        </div>
                    ))}
                </div>
            </div>
        );
        addToast(item, {appearance: 'none', toastId, position: 'center'});
        setToastList([...toastList, toastId]);
    };



    // render the component
    return (
        <div className="roomOuterContainer">
            <div className="roomInnerContainer">
                <div className="infoBarContainer">
                    <div className="roomNameContainer">
                        <button onClick={() => {
                            if (!navigator.clipboard)   return;
                            navigator.clipboard.writeText(room.roomId).then(() => {
                                addToast(`RoomId copied!`, {appearance: 'info', autoDismiss: true, timeOut: 2000})
                            })
                        }}>
                            <strong>Room Id: </strong>{room.roomId}
                        </button>
                    </div>
                    <div className="infoBarOperations">
                        <button onClick={showMeetingDetails}><FontAwesomeIcon icon={faEllipsisH} /></button>
                        <button onClick={promptExit}><FontAwesomeIcon icon={faTimes} /></button>
                    </div>
                </div>

                <div className="messagesOuterContainer" id="messagesContainer">
                    {messageList.map(message => (
                            <Message message={message} key={message.id}/>
                    ))}
                </div>

                <ChatInput />
            </div>
        </div>
    );
};
export default Room;