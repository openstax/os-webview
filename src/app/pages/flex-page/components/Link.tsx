import React from 'react';

export interface LinkProps {
    text: string;
    ariaLabel?: string;
    target: [{value: string}]
}

export function Link(props: LinkProps) {
    return <a href={props.target[0].value} aria-label={props.ariaLabel}>{props.text}</a>;
}

