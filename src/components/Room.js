import React, { useContext, useEffect, useRef} from 'react';
import ChatInput from './ChatInput';
import '../styles/Room.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faEllipsisH} from '@fortawesome/free-solid-svg-icons';
import ChatContext from '../context/ChatContext';
import Message from './Message';
import {addToast} from '../utility/ToastedNotes';

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
        messageList
    } = useContext(ChatContext);

    // use local-storage to keep track of visibility
    window.onblur = (event => {
        localStorage.setItem('windowVisible', 'false');
    });
    window.onfocus = (event => {
        localStorage.setItem('windowVisible', 'true');
    });

    // // componentDidMount - called exactly once
    // useEffect(()=>{
    //     // if (!socket)    return;
    //     // socket.on('message', message => {            
    //     //     setMessageList(messageList => [...messageList, message]);

    //     //     // send a notification to user if required
    //     //     let allowNotifications = (localStorage.getItem('allowNotifications') === 'true');

    //     //     // check if notifications are enabled
    //     //     if (allowNotifications) {
    //     //         // check if window is visible
    //     //         let windowVisible = (localStorage.getItem('windowVisible') === 'true');
    //     //         // check if notification is to be sent
    //     //         if (!windowVisible || (windowVisible && document.visibilityState === 'hidden')) {
    //     //             // add a notification
    //     //             addNotification({
    //     //                 title: 'ROOM DECK',
    //     //                 message: `New message in room with id ${room.roomId}`,
    //     //                 native: true,
    //     //                 icon: {icon}
    //     //             });    
    //     //         }
    //     //     }
    //     // });
    //     // socket.on('roomDetails', ({room}) => {
    //     //     setRoom(room);
    //     // });
    // }, []);

    // // fires the send message event
    // const sendMessage = (event)=>{
    //     // if(event) event.preventDefault();
    //     // let div = document.getElementById('chatInput');
    //     // let content = div.innerHTML;
    //     // if (!content)   return;
    //     // if (!socket)    return;
    //     // let encrypted = encryptText(room, content);
    //     // socket.emit('sendMessage', encrypted, error => {
    //     //     // if (error) ToasterNotification.notify(false, error)
    //     // });
    //     // div.innerHTML = '';
    // };

    // // fires the send attachment event
    // const sendAttachment = (attachment) => {
    //     // if (!socket)    return;
    //     // let encrypted = encryptText(room, attachment);
    //     // socket.emit('sendMessage', encrypted, (error, message) => {
    //     //     // if (error) ToasterNotification.notify(false, message || error);
    //     // });
    // };



    // prompts the user for exit operation
    const promptExit = () => {
        addToast('hello world', {appearance: 'none'});
    };
    // displays more details about the meeting
    const showMeetingDetails = () => {

    };



    // render the component
    return (
        <div className="roomOuterContainer">
            <div className="infoBarContainer">
                <div className="roomNameContainer">
                    <button>
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
    );
};
export default Room;