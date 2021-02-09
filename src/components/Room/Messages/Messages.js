import React from 'react';
import './Messages.css';
import MessageViewer from './MessageViewer/MessageViewer';
import ScrollToBottom from 'react-scroll-to-bottom';


// switched to class component because functional component
// doesnot allow refs and wwe need a ref of this component for printing
class Messages extends React.Component{
    constructor(props){
        super(props);
    }
    render = () => {
        let messageList = this.props.messageList;
        let messageViewersList = messageList.map( (message, index) => {
            return (<MessageViewer message={message} key={index} 
                        messageId={index} user={this.props.user} room={this.props.room}/>);
        });
    
            return (
            <div className="messagesOuterContainer row content" id='clientMessageContainer'>
                <ScrollToBottom>
                    {messageViewersList}
                </ScrollToBottom>
            </div>
        );    
    };
}


// const Messages = (props) => {
//     let messageList = props.messageList;
//     let messageViewersList = messageList.map( (message, index) => {
//         return (<MessageViewer message={message} key={index} messageId={index} user={props.user}/>);
//     });


//     return (
//         <div className="messagesOuterContainer row content" id='clientMessageContainer'>
//             <ScrollToBottom>
//                 {messageViewersList}
//             </ScrollToBottom>
//         </div>
//     );
// };
export default Messages;