import React, {useState} from 'react';
import './a-component-template.css';

export default function ({message}) {

    return (
        <React.Fragment>
        {/*
            React.Fragment is a parent node when you don't want to
            have a parent node.
        */}
            Your message here: <h2>{message}</h2>
        </React.Fragment>
    );
}
