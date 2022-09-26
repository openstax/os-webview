import React from 'react';
import {useToggle} from '~/helpers/data';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus';
import './collapsing-pane.scss';

export default function CollapsingPane({title, children}) {
    const [isOpen, toggle] = useToggle(false);
    const plusOrMinus = isOpen ? faMinus : faPlus;

    return (
        <div className="collapsing-pane">
            <div className="control-bar" onClick={toggle}>
                <div>{title}</div>
                <FontAwesomeIcon icon={plusOrMinus} />
            </div>
            <div hidden={!isOpen} >
                {children}
            </div>
        </div>
    );
}
