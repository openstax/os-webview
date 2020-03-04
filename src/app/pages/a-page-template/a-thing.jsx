import React from 'react';
import ReactDOM from 'react-dom';

function child(props) {
    return <h1>{props.message}</h1>;
}

export default function (props) {
    const parent = props.el;

    ReactDOM.render(child(props), parent);
};
