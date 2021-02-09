import React, { useState } from 'react';
import Homepage from './components/Homepage';
import Room from './components/Room';
import ToastedNotes, {addToast} from './utility/ToastedNotes';
import Modal from './utility/Modal';
import io from 'socket.io-client';
import Overlay from './utility/Overlay';
import RectangularLoader from './utility/RectangularLoader';
import './styles/App.scss';
import {CONFIG, MESSAGE_TYPE} from './utility/DataAccessObject';
import ChatContext from './context/ChatContext';



// flags an error message
const flagError = (message) => addToast(message, {appearance: 'error'});
// flags an information message
const flagInfo = (message, autoDismiss = false) => addToast(message, {appearance: 'info', autoDismiss});

// functional component to be rendered
const App = (props)=>{
	// const [room, setRoom] = useState({
	// 	participants: [],
	// 	roomId: 'abcdefghij'
	// });
	const [room, setRoom] = useState(null);
	const [messageList, setMessageList] = useState([
        {id: 1, content: 'this is a busy day!', socketId: 1,
            type: MESSAGE_TYPE.TEXT, username: 'shubham'},
        {id: 2, content: 'hi this is a busy day!', socketId: 2,
			type: MESSAGE_TYPE.TEXT, username: 'hello'},
		{id: 2, content: 'admin message!', socketId: 2,
            type: MESSAGE_TYPE.TEXT, username: 'hello', admin: true}			
    ]);

	const [loadingMessage, setLoadingMessage] = useState(null);

	const createOrJoinRoom = (roomId, username) => {

	};

	const sendMessage = (type, message, caption = null, filename = null) => {
		// sends the message to everybody
		let list = [...messageList];
		let item = {
			id : list.length,
			content: message,
			type: type,
			socketId: list.length,
			username: 'shubham', 
			caption: caption,
			filename: filename
		};
		list.push(item);
		setMessageList(list);

		// // get the container and scroll it to bottom
		// let div = document.getElementById(`messagesContainer`);
		// if (!div)   return;
		// div.scrollTop = div.scrollHeight;
	};


    // prepares the content
    const prepareMessage = () => {

    };

	// decide the component to be rendered
	let itemToDisplay = <Homepage createOrJoinRoom={createOrJoinRoom} />;
	if (room) {
		itemToDisplay = <Room room={room} />;
	}
	// render the component
	return (
		<div className="app">
			<ChatContext.Provider
				value={{
					// used for homepage
					createOrJoinRoom, 

					// used for room
					room, sendMessage,
					MESSAGE_TYPE,
					messageList, setMessageList,
					prepareMessage
				}}>
				{itemToDisplay}
			</ChatContext.Provider>
			{loadingMessage && 
			<Overlay>
				<RectangularLoader />
				<div className="loadingMessage">{loadingMessage}</div>
			</Overlay>}
			<Modal />
			<ToastedNotes />
		</div>
	);
};

export default App;
