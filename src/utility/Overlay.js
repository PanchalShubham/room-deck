import React from 'react';
import '../styles/Overlay.scss';
export default function Overlay(props){
    return (
        <div id="overlay" {...props}>
            <div className="background"></div>
            <div className="content">
                {props.children}
            </div>
        </div>
    );
};