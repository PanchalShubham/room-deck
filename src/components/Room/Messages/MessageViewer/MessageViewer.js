import React from 'react';
import './MessageViewer.css';
import parse from 'html-react-parser';
import CryptoJS from 'crypto-js';

const MessageViewer = (props)=>{
    let {isAdmin, content, author, timeStamp} = props.message;
    let {room} = props;
    let isSent = !isAdmin && (author === props.user.name);
    let isClient = !isAdmin && !isSent;

    let classList1 = ['individualMessageContainer'];
    if (isAdmin)    classList1.push('center');
    if (isSent)     classList1.push('right');
    if (isClient)    classList1.push('left');

    let classList2 = ['individualMessage'];
    if (isAdmin)    classList2.push('adminMessage');
    if (isSent)     classList2.push('sentMessage');
    if (isClient)    classList2.push('clientMessage');

    // if message is sent by admin then replace username with `You`
    if (isAdmin) content = content.replace(props.user.name, 'You');
    
    if (!isAdmin) 
    try{ 
        // content = decryptMessage(room, content); 
    }catch (error) { }
  
    // try to parse user's message
    let messageContent = null;
    try {
        messageContent = parse(`<div>${content}</div>`);
    } catch (error) {
        console.log(error);
    }

    return (
        <div className={classList1.join(' ')} id={props.messageId}>
            <div className={classList2.join(' ')}>
                {isClient && <p className='individualMessageAuthor'>{author}</p>}
                {messageContent}
                {!isAdmin && <p className='individualMessageTimeStamp'>{timeStamp}</p>}
            </div>
        </div>
    );
};
export default MessageViewer;