import React from 'react';

export interface LinkFields {
    text: string;
    ariaLabel?: string;
    target: string;
}
export interface LinkProps {
    link: LinkFields;
}

export function Link(props: LinkProps) {
    return <a href={props.link.target} aria-label={props.link.ariaLabel}>{props.link.text}</a>;
}

