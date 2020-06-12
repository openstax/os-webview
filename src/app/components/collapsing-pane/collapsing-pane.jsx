import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './collapsing-pane.css';

export default function CollapsingPane({title, children}) {
    const [isOpen, updateIsOpen] = useState(false);
    const plusOrMinus = isOpen ? 'minus' : 'plus';

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
