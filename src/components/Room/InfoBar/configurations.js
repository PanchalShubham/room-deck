import React, { useState} from 'react';
// import toaster from 'toasted-notes';
// import 'toasted-notes/src/styles.css';
import './modal-notifications.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

// method is invoke to export the chat
const onExportChat = (roomId)=>{
    let date = new Date();
    let day = date.getDay();
    let month = date.getMonth();
    let year = date.getFullYear();
    let hours = date.getHours();
    let minutes = date.getMinutes();
    let seconds = date.getSeconds();
    let filename = `ROOM DECK [${day}/${month}/${year} ${hours}:${minutes}:${seconds}][${roomId}].html`;

    let link = document.createElement('a');
    link.setAttribute('download', filename);
    let text = document.documentElement.innerHTML;
    let extraStyle = `.closeButtonContainer, .Toaster, .chatInputOuterContainer{display: none; }`;
    text = text.replace('<head>', '<head><style>' + extraStyle + "</style>");
    link.setAttribute('href', 'data:text/html;charset=utf-8,' + encodeURIComponent(text));
    link.click();
};    


// react-component for displaying configurations
const DisplayConfigurations = (props)  => {
    // fetch the props
    let {room, user, participants, onClose, exitRoom} = props;

    // read the old content from local-storage
    let startEnterIsSend = localStorage.getItem('enterIsSend');
    startEnterIsSend = !(startEnterIsSend && startEnterIsSend === "false");
    let startAllowNotifications = localStorage.getItem('allowNotifications');
    startAllowNotifications = !(startAllowNotifications && startAllowNotifications === "false");

    const [enterIsSend, setEnterIsSend] = useState(startEnterIsSend);
    const [allowNotifications, setAllowNotifications] = useState(startAllowNotifications);

    return (
        <div className="promptContainer">
            <div className="configContainer">
                <div className="configRoomIdContainer">
                    <strong>Room Id:</strong> {room.roomId}
                    <button className="closeConfigContainer"
                        onClick={onClose}><FontAwesomeIcon icon={faTimes} /></button>
                </div>
                <hr/>
                <div className="configOptionsContainer">
                    <input type="checkbox" id='enterIsSendCheckbox' 
                        checked={enterIsSend} onChange={event => {
                            localStorage.setItem('enterIsSend', !enterIsSend);
                            setEnterIsSend(!enterIsSend);
                        }}/>
                    <label htmlFor='enterIsIsend'>Enter is Send</label>
                    <br/>
                    <input type="checkbox" id='allowNotificationsCheckbox'
                        checked={allowNotifications} onChange={event => {
                            localStorage.setItem('allowNotifications', !allowNotifications);
                            setAllowNotifications(!allowNotifications);
                        }}/>
                    <label htmlFor='allowNotifictaionsCheckbox'>Allow notifications</label>
                    <br/>
                    {room.author === user.name && 
                        <button className="exitButton exitNoButton"
                        onClick={event => {
                            onClose();
                            onExportChat(room.roomId);
                        }}>Export chat</button>
                    }
                    <button className="exitButton exitYesButton"
                        onClick={event => {
                            onClose();
                            exitRoom();
                        }}>Exit Room</button>
                </div>
                <div className="configRoomDetailsContainer">
                    {/* <strong>Agenda:</strong> {room.agenda} */}
                </div>
                <hr/>
                <div className="configRoomParticipantsContainer">
                    <strong>Participants: </strong> <br/>
                    {participants.map(user => {
                        return (<p key={user.name}>{user.name} {user.name === room.author && ' (Admin) '}</p>);                                
                    })}
                </div>
            </div>
        </div>
    );
};


class ModalNotifications {
    // modal for exit confirmation
    displayConfirmExit = ({exitRoom})=>{
        // toaster.notify(({ onClose }) => {
        //     let item = (
        //         <div className="exitPromptMessageContainer">
        //             Are you sure you want to leave this room? <br/>
        //             {/* {isRoomCreator &&  `You created this room and if you leave everybody will be disconnected!`} <br/> */}
        //             <button className="exitYesButton exitButton"
        //                 onClick={event => {
        //                     onClose();
        //                     exitRoom();
        //                 }}>Yes</button>
        //             <button className="exitNoButton exitButton" onClick={onClose}>No</button>
        //         </div>
        //     );

        //     return (
        //         <div className="promptContainer">
        //             <div className="exitPromptContainer">
        //                 {item}
        //             </div>
        //         </div>
        //     );
        // }, {
        //     position: "top",
        //     duration: null
        // });    
    };





    // displays the configurations
    displayConfigurations = (props)=>{
        let {room, user, participants, exitRoom} = props;        
        // toaster.notify(({ onClose }) => {
        //     return (
        //         <DisplayConfigurations room={room} user={user} participants={participants} 
        //                 exitRoom={exitRoom} onClose={onClose}/>
        //     );
        // }, {
        //     position: "top",
        //     duration: null
        // });    
    };

};

export default ModalNotifications;
