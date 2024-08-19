import React from 'react';
import $ from '~/helpers/$';

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
    const onClick = React.useCallback((e: React.MouseEvent<HTMLAnchorElement>) => {
        if (link.target.type === 'anchor') {
            e.preventDefault();
            const target = document.getElementById(link.target.value.substring(1));

            if (target) {
                $.scrollTo(target);
            }
        }
    }, [link]);

    return <a
        aria-label={link.ariaLabel || undefined}
        {...props}
        href={link.target.value}
        onClick={onClick}
    >{link.text}</a>;
}
