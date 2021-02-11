import React, { useContext, useState } from 'react';
import '../styles/Homepage.scss';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart } from '@fortawesome/free-solid-svg-icons';
import {addToast} from '../utility/ToastedNotes';
import ChatContext from '../context/ChatContext';

// flags an error message
const flagError = (message) => addToast(message, {appearance: 'error'});
// functional component to be rendered
export default function Homepage(props) {
    // get the function from the props
    const {
        createOrJoinRoom,
        username, setUsername,
        roomId, setRoomId,
        restrictAccess, setRestrictAccess,
    } = useContext(ChatContext);
    const [nameError, setNameError] = useState('');

    // handles the onsubmit request
    const onSubmit = (event) => {
        event.preventDefault();
        let name = username.trim();
        if (name === '') return flagError(`Please provide a valid username`);
        // create or join room
        createOrJoinRoom();
    };

    // get the text to be displayed
    let text = (roomId === '' ? 'Create' : 'Join');
    let disabled = (roomId);
    // actual component to be rendered
    return (
        <div className="homepageOuterContainer">
            <div className="homepage">
                <div className="brand">
                    <h1>ROOM DECK</h1>
                    <p>
                        Create an instant room and start chatting with friends, family or community. <br/>
                        A completely free service available 24x7 with no registrations!
                    </p>
                </div>
                <div className="formDiv">
                    <div className="formHeading">
                        {text} ROOM
                    </div>
                    <form autoComplete="off" method="POST" onSubmit={onSubmit}>
                        <input type="text" name='username' value={username}
                            className="input" placeholder='Your Name'
                            onChange={event => {
                                let {value} = event.target;
                                setUsername(value);
                                if (value.trim() === '') setNameError('Please provide a valid name!');
                                else                     setNameError('');
                            }}/>
                        <div className="formErrorMessage">{nameError}</div>
                        <input type="text" name='roomId' value={roomId}
                            className="input" placeholder='Room Id'
                            onChange={event => {
                                // update the value
                                setRoomId(event.target.value);
                                // take decision based on value
                                if (event.target.value) setRestrictAccess(false);
                            }}/>
                        <div className="checkbox-input">
                            <input type="checkbox" 
                                checked={restrictAccess} disabled={disabled}
                            onChange={() => setRestrictAccess(!restrictAccess)} /> 
                            <span className={disabled ? 'disabled' : ''}>Restrict access (requires permission to join)</span>
                        </div>
                        <input type="submit" className="submitButton" value={text}></input>
                    </form>
                </div>
                <div className="footer">
                    Made with <span><FontAwesomeIcon icon={faHeart} /></span> by <a href="http://shubhampanchal.herokuapp.com">Shubham Panchal</a>
                </div>
            </div>
        </div>
    );
};
