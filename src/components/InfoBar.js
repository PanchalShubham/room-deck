import React from 'react';
import '../styles/InfoBar.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faTimes, faEllipsisH} from '@fortawesome/free-solid-svg-icons';

const InfoBar = (props)=>{
    let {room} = props;
    return (
        <div className="infoBarContainer row header">
            <div className="roomNameContainer">
                <button>
                    <strong>Room Id: </strong>{room.roomId}
                </button>
            </div>
            <div className="closeButtonContainer">
                <button><FontAwesomeIcon icon={faEllipsisH} /></button>
                <button><FontAwesomeIcon icon={faTimes} /></button>
            </div>
        </div>
    );
};
export default InfoBar;