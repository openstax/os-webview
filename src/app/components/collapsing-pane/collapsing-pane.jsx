import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlus} from '@fortawesome/free-solid-svg-icons/faPlus';
import {faMinus} from '@fortawesome/free-solid-svg-icons/faMinus';
import './collapsing-pane.scss';

export default function CollapsingPane({title, children}) {
    const [isOpen, updateIsOpen] = useState(false);
    const plusOrMinus = isOpen ? faMinus : faPlus;

    function toggle() {
        updateIsOpen(!isOpen);
    }

    return (
        <div className="collapsing-pane">
            <div class="control-bar" onClick={toggle}>
                <div>{title}</div>
                <FontAwesomeIcon icon={plusOrMinus} />
            </div>
            <div hidden={!isOpen} >
                {children}
            </div>
        </div>
    );
}
