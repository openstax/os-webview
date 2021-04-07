import React from 'react';
import './a-component-template.scss';

export default function ComponentTemplate({message}) {
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
