import React, {useState} from 'react';
import WrappedJsx from '~/controllers/jsx-wrapper';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './mobile-selector.css';

function MenuItem({selectedValue, value, onChange}) {
    const selectedClass = value === selectedValue ? 'selected' : null;

    function onClick() {
        onChange(value);
    }

    return (
        <div role="menuitem" className={selectedClass} onClick={onClick}>{value}</div>
    );
}

function Menu({selectedValue, values, onChange}) {
    return (
        <div className="fixed-overlay">
            <div role="menu">
                {
                    values.map((value) =>
                        <MenuItem {...{selectedValue, value, onChange}} key={value} />
                    )
                }
            </div>
        </div>
    );
}

export default function MobileSelector({selectedValue, values, onChange}) {
    const [showingMenu, setShowingMenu] = useState(false);

    function toggleShowing() {
        setShowingMenu(!showingMenu);
    }
    function selectItem(value) {
        setShowingMenu(false);
        onChange(value);
    }

    return (
        <div className="mobile-selector">
            <div className="selector-button" onClick={toggleShowing}>
                <span>{selectedValue}</span>
                <FontAwesomeIcon icon="caret-down" />
            </div>
            {
                showingMenu &&
                    <Menu selectedValue={selectedValue} values={values} onChange={selectItem} />
            }
        </div>
    );
}
