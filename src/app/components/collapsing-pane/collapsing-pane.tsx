import React from 'react';
import {useToggle} from '~/helpers/data';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus';
import './collapsing-pane.scss';

export default function CollapsingPane({
    title,
    children
}: React.PropsWithChildren<{
    title: string;
}>) {
    const [isOpen, toggle] = useToggle(false);
    const plusOrMinus = isOpen ? faMinus : faPlus;

    return (
        <details className="collapsing-pane" open={isOpen} onToggle={() => toggle()}>
            <summary className="control-bar">
                <div>{title}</div>
                <FontAwesomeIcon icon={plusOrMinus} />
            </summary>
            <div>{children}</div>
        </details>
    );
}
