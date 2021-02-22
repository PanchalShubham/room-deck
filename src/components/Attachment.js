// imports
import React from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import '../styles/Attachment.scss';
import DownloadIcon from '../assets/download.png';
import * as MESSAGE_TYPE from '../utility/MessageType';

// component to be rendered
export default function Attachment(props){
    let {type, content, file} = props;
    let filename = file.name;
    let item = null;
    if (type === MESSAGE_TYPE.FILE)
        item = (
            <a href={content} className="fileAttachment" 
                download={filename}>
                <img src={DownloadIcon} alt=""/> {filename}
            </a>
        );
    else if (type === MESSAGE_TYPE.IMAGE) item = (<img src={content} alt="" />);
    else if (type === MESSAGE_TYPE.AUDIO) item = (<AudioPlayer controls src={content} />);
    else if (type === MESSAGE_TYPE.VIDEO) item = (<video controls src={content} />);
    // render the component
    return (
        <div className="attachment">
            {item}
        </div>
    );
};