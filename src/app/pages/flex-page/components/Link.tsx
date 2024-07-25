import React from 'react';

export interface LinkFields {
    text: string;
    ariaLabel?: string;
    target: {
      type: string;
      value: string;
    };
}

type LinkProps = {
    link: LinkFields;
} & React.AnchorHTMLAttributes<HTMLAnchorElement>

export function Link({link, ...props}: LinkProps) {
    return <a aria-label={link.ariaLabel} {...props} href={link.target.value}>{link.text}</a>;
}
