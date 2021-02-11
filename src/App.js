import React, { useCallback, useEffect, useState } from 'react';
import Homepage from './components/Homepage';
import Room from './components/Room';
import ToastedNotes, {addToast, removeToast} from './utility/ToastedNotes';
import Modal from './utility/Modal';
import io from 'socket.io-client';
import Overlay from './utility/Overlay';
import RectangularLoader from './utility/RectangularLoader';
import './styles/App.scss';
import {CONFIG, MESSAGE_TYPE, encryptMessage, decryptMessage} from './utility/DataAccessObject';
import ChatContext from './context/ChatContext';
import { v4 as uuidv4 } from 'uuid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes, faCheck } from '@fortawesome/free-solid-svg-icons';

// functional component to be rendered
const App = (props)=>{
	const [socket, setSocket] = useState(null);
	const [room, setRoom] = useState(null);
	const [username, setUsername] = useState('');
	const [roomId, setRoomId] = useState('');
	const [userId, setUserId] = useState('');
	const [restrictAccess, setRestrictAccess] = useState(false);
	const [messageList, setMessageList] = useState([]);
	const [toastList, setToastList] = useState([]);
	const [loadingMessage, setLoadingMessage] = useState('');
	const [connectionErrorCount, setConnectionErrorCount] = useState(0);

	// flags an error message
	const flagError = (message) => {
		// create a notification
		addToast(message, {appearance: 'error'});
		// clear the loading message (if any)
		setLoadingMessage('');
	}
	// flags an information message
	const flagInfo = (message, autoDismiss = false) => {
		// create a notification
		addToast(message, {appearance: 'info', autoDismiss});
		// clear the loading message (if any)
		setLoadingMessage('');
	}
	// updates the details of the room
	const updateRoomDetails = useCallback((room, errorMessage, infoMessage, autoDismiss = false)=>{
		// update the details of the room
		setRoom(room);
		// check if room is available
		if (room) {
			// update the roomId
			setRoomId(room.roomId);
		} else {
			// disconnect the socket
			socket.disconnect();
			// clear the roomId
			setRoomId('');
			// clear the userId
			setUserId(null);
			// clear the message list
			setMessageList([]);
			// remove all the toasts
			for (let i = 0; i < toastList.length; ++i) removeToast(toastList[i]);
			// update the toasts list
			setToastList([]);
			// refresh the connectionErrorCount
			setConnectionErrorCount(0);
		}
		// check if errorMessage is available
		if (errorMessage)	flagError(errorMessage);
		// check if infoMessage is available
		if (infoMessage)	flagInfo(infoMessage, autoDismiss);
		// clear the loadingMessage
		setLoadingMessage('');
	}, [socket, toastList]);


	// update the socket instance
	useEffect(() => {
        // console.log('fetching ip....');
        // fetch the client-ip
        fetch('https://api.ipify.org?format=json').then(response => response.json()
        ).then(response => {
			let ip = response.ip;
			// console.log(ip);
            // ip = new Date();
            // console.log(ip);
			// create a socket instance
			let mySocket = io(CONFIG.ENDPOINT, {
				autoConnect: false,
				forceNew: true,
				reconnection: true,
				reconnectionAttempts: CONFIG.MAX_RECONNECTION_ATTEMPTS,
				query : {
					clientIp : ip
				}
			});
			// update the socket for the client
			setSocket(mySocket);
        }).catch(error => {
            console.log(error);
        });
	}, []);

	// implements the listener on socket
	useEffect(() => {
		// check if socket is available
		if (!socket)	return;
		// remove all the listeners from socket
		socket.off();
		socket.on(CONFIG.CONNECT, () => {
			// reset the connection error count
			setConnectionErrorCount(0);
			// check if room already exist
			if (room)	return socket.emit(CONFIG.RE_JOIN, roomId, userId, username);
			// create a temporary id
			let tempId = uuidv4();
			// update the user id
			setUserId(tempId);
			// emit the create or join room event
			socket.emit(CONFIG.CREATE_OR_JOIN, roomId, tempId, username, restrictAccess);
		});
		// on disconnection notify
		socket.on(CONFIG.DISCONNECT, () => {
			// update the error message
			setLoadingMessage(`Hold on! I'm trying to you back.`);
		});
		// on connection error
		socket.on(CONFIG.CONNECTION_ERROR, () => {
			// increase the connection error count
			let count = connectionErrorCount + 1;
			// update the count
			setConnectionErrorCount(count);
			// compare the count
			if (connectionErrorCount === CONFIG.MAX_RECONNECTION_ATTEMPTS + 1) {
				// throw error
				flagError(`Failed to connect`);
				// clear the error message
				setLoadingMessage('');
			}
		});
		// if there is an ip error then inform the client
		socket.on(CONFIG.IP_ERROR, flagError);
		// if already a session is running
		socket.on(CONFIG.FOUND_RUNNING_ROOM_SESSION, flagError);
		// if room is created successfully then update room details
		socket.on(CONFIG.CREATE_ROOM_SUCCESS, updateRoomDetails);
		// if no such room found
		socket.on(CONFIG.NO_SUCH_ROOM_ERROR, () => updateRoomDetails(null, `Failed to find a room with roomId ${roomId}`));
		// user has joined via another window
		socket.on(CONFIG.JOINED_VIA_ANOTHER_WINDOW, () => updateRoomDetails(null, null, `You have joined from another window!`));
		// if user has successfully joined then update the details
		socket.on(CONFIG.JOIN_ROOM_SUCCESS, updateRoomDetails);
		// inform the user about waiting request
		socket.on(CONFIG.WAIT_FOR_APPROVAL, () => 
			setLoadingMessage(`You will be able to join with id ${userId} when admin lets you in!`));
		// infor the user about request rejection
		socket.on(CONFIG.REQUEST_TO_JOIN_REJECTED, () => 
			updateRoomDetails(null, `Your request to join the session is rejected by admin`));
		// if admin permits the client then let the client in!
		socket.on(CONFIG.LET_CLIENT_IN, () => socket.emit(CONFIG.LET_CLIENT_IN, roomId, userId, username));
		// when someone makes a request to join
		socket.on(CONFIG.JOIN_ROOM_REQUEST, (socketId, userId, username) => {
			let toastId = uuidv4();
			let item = (
				<div className="pending-request">
					<span>{username}</span> wants to join this session<br/>
					(<span>{userId}</span>)
					<div className="request-operations">
						<button className="success-button"
							onClick={() => {
								// remove the toast
								removeToast(toastId);
								// accept the request
								socket.emit(CONFIG.APPROVE_REQUEST, roomId, socketId);
							}}><FontAwesomeIcon icon={faCheck}/> Accept </button>
						<button className="error-button"
							onClick={() => {
								// remove the toast
								removeToast(toastId);
								// reject the request
								socket.emit(CONFIG.REJECT_REQUEST, roomId, socketId);
							}}><FontAwesomeIcon icon={faTimes}/> Reject </button>
					</div>
				</div>
			);
			addToast(item, {appearance: 'none', toastId, position: 'center'});
			// store the toastId
			setToastList([...toastList, toastId]);
		});
		// on room-terminated
		socket.on(CONFIG.TERMINATE_ROOM, message => {
			// emit the leave room event
			socket.emit(CONFIG.EXIT_FROM_ROOM, roomId, username);
			// update the details of the room
			updateRoomDetails(null, null, message);
		});
		// time out for room
		socket.on(CONFIG.ROOM_TIME_OUT, message => {
			// emit the leave room event
			socket.emit(CONFIG.EXIT_FROM_ROOM, roomId, username);
			// update the details of the room
			updateRoomDetails(null, null, message);
		});

		// when someone joins the room
		socket.on(CONFIG.JOINED_ROOM, (room, username, timeStamp) => {
			// update the details of the room
			updateRoomDetails(room);
			// add a join message
			let oldMessage = [...messageList];
			// add a new message to message list
			oldMessage.push({
				id: oldMessage.length,
				content: `${username} has joined`,
				timeStamp,
				admin: true
			});
			// add this message to list of messages
			setMessageList(oldMessage);
		});
		// when someone leaves the room
		socket.on(CONFIG.LEFT_ROOM, (room, username, timeStamp) => {
			// update the details of the room
			updateRoomDetails(room);
			// add a join message
			let oldMessage = [...messageList];
			// add a new message to message list
			oldMessage.push({
				id: oldMessage.length,
				content: `${username} has left`,
				timeStamp,
				admin: true
			});
			// add this message to list of messages
			setMessageList(oldMessage);
		});

		// when someone sends a message
		socket.on(CONFIG.MESSAGE_ALL, (message, timeStamp) => {
			// decrypt the message
			let decrypted = null;
			try{decrypted = decryptMessage(room.key, message)}catch(error){}
			// check if message was decrypted
			if (!decrypted)	return;
			// add properties to the message
			decrypted.timeStamp = timeStamp;
			decrypted.amIAuthor = (userId === decrypted.userId);
			// add this message to list of messages
			setMessageList([...messageList, decrypted])
		});
	}, [socket, room, roomId, userId, username, toastList,
		restrictAccess, messageList, updateRoomDetails,
		connectionErrorCount,
	]);

	// function to create or join room
	const createOrJoinRoom = () => {
		// check if socket is available
		if (!socket)	return flagInfo(`Please wait! I'm fetching your IP`);
		// disconnect the socket if already connected
		socket.disconnect();
		// connect to the endpoint
		socket.connect();
		// inform the user about waiting
		setLoadingMessage(`Please wait! I'm processing your request...`);
	};

	// exit from room
	const exitFromRoom = () => {
		// emit the exit from room event
		socket.emit(CONFIG.EXIT_FROM_ROOM, roomId, username);
		// clear the room
		updateRoomDetails(null);
	};

	// creates and sends the message
	const sendMessage = (message) => {
		// add additional properties to the message
		message.id = uuidv4();
		message.username = username;
		message.userId = userId;
		// encrypt the message
		let encryptedContent = null;
		try{encryptedContent = encryptMessage(room.key, message);}catch(error) {}
		if (!encryptedContent)	flagError(`Failed to encrypt your message!`);
		else 					socket.emit(CONFIG.MESSAGE_ALL, roomId, encryptedContent);
	};

	// decide the component to be rendered
	let itemToDisplay = <Homepage createOrJoinRoom={createOrJoinRoom} />;
	if (room) itemToDisplay = <Room room={room} />;
	// render the component
	return (
		<div className="app">
			<ToastedNotes>			
				<ChatContext.Provider
					value={{
						// used for homepage
						createOrJoinRoom, 
						username, setUsername,
						roomId, setRoomId,
						restrictAccess, setRestrictAccess,

						// used for room
						room, sendMessage,
						MESSAGE_TYPE,
						messageList, setMessageList,
						toastList, setToastList,
						exitFromRoom,
						userId,
					}}>
					{itemToDisplay}
				</ChatContext.Provider>
				{loadingMessage && 
				<Overlay>
					<RectangularLoader />
					<div className="loadingMessage">{loadingMessage}</div>
				</Overlay>}
				<Modal />
			</ToastedNotes>
		</div>
	);
};

export default App;
