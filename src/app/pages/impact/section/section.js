import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

export function Section({id, className, children, contentClass=true, ...otherProps}) {
    const classList = [id];

    if (contentClass) {
        classList.push('content');
    }

    return (
        <section id={id} className={className} {...otherProps}>
            <div className={classList.join(' ')}>
                {children}
            </div>
        </section>
    );
}

export function HeadingAndDescription({heading, description, classList=['text-content'], children}) {
    return (
        <div className={classList.join(' ')}>
            <h2>{heading}</h2>
            <RawHTML html={description} />
            {children}
        </div>
    );
}
