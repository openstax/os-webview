import React, {useState} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import './mobile-selector.scss';

function MenuItem({selectedValue, value, onChange}) {
    const selectedClass = value === selectedValue ? 'selected' : null;
    const onClick = React.useCallback(
        () => onChange(value),
        [onChange, value]
    );

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
    const toggleShowing = React.useCallback(
        () => setShowingMenu(!showingMenu),
        [showingMenu]
    );
    const selectItem = React.useCallback(
        (value) => {
            setShowingMenu(false);
            onChange(value);
        },
        [onChange]
    );

    return (
        <div className="mobile-selector">
            <div className="selector-button" role="button" onClick={toggleShowing}>
                <span>{selectedValue}</span>
                <FontAwesomeIcon icon={faCaretDown} />
            </div>
            {
                showingMenu &&
                    <Menu selectedValue={selectedValue} values={values} onChange={selectItem} />
            }
        </div>
    );
}
