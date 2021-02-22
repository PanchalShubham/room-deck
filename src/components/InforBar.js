import React, {useContext} from 'react';
import ChatContext from '../context/ChatContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faEllipsisH, faCheck, faUserAlt, faHourglassEnd, faBroom} from '@fortawesome/free-solid-svg-icons';
import { addToast, removeToast } from '../utility/ToastedNotes';
import { v4 as uuidv4 } from 'uuid';
import '../styles/InfoBar.scss';


export default function InfoBar(props) {
    // get the properties in the context
    const {
        room, 
        userId,
        exitFromRoom,
        toastList, setToastList,
        deleteAllMessages,
        setSelfDestructingTime
    } = useContext(ChatContext);

    //options for self-destructing messages
    const options = [
        {key: 'Self destruct timer', value: 0, disabled: true},
        {key: 'off', value: 0},
        {key: '5 seconds', value: 5},
        {key: '10 seconds', value: 10},
        {key: '30 seconds', value: 30},
        {key: '1 minute', value: 60},
        {key: '2 minutes', value: 2 * 60},
        {key: '5 minutes', value: 5 * 60},
        {key: '10 minutes', value: 10 * 60},
        {key: '30 minutes', value: 30 * 60},        
    ];


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
        let amIOwner = (userId === room.adminId);
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
                <div className="meeting-configuration">
                    <button onClick={() => {
                        deleteAllMessages();
                        removeToast(toastId);
                    }}>
                        <FontAwesomeIcon icon={faBroom}/> Clear messages
                    </button>
                    {amIOwner && 
                    <select 
                        value={room.selfDestructTime}
                        onChange={event => {
                            setSelfDestructingTime(event.target.value);
                            removeToast(toastId);
                        }}
                        id="selfDestructingDropdown">
                        {options.map(option => 
                            <option
                                key={option.key} 
                                value={option.value}
                                disabled={option.disabled}>
                                {option.key}
                            </option>)}
                    </select>}
                    {!amIOwner && 
                    <span className="info">
                        <FontAwesomeIcon icon={faHourglassEnd} /> Self-destructing-timer is set to {room.selfDestructTime > 0 ? room.selfDestructTime : "off"}
                    </span>}
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



    return (
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
    );
};