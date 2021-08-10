import React, {useEffect} from 'react';
import useDropdownContext from '../dropdown-context';
import {useLocation} from 'react-router-dom';
import './menu-expander.scss';

export default function MenuExpander({active, onClick}) {
    const ref = React.useRef();
    const location = useLocation();
    const {setActiveDropdown} = useDropdownContext();

    useEffect(() => {
        if (active) {
            onClick();
            setActiveDropdown({});
        }
    }, [location]); // eslint-disable-line react-hooks/exhaustive-deps

    function onClickAndBlur(event) {
        onClick(event);
        ref.current.blur();
    }

    return (
        <button
            type="button"
            className="expand"
            aria-haspopup="true" aria-label="Toggle Meta Navigation Menu"
            tabIndex="0"
            onClick={onClickAndBlur}
            ref={ref}
        >
            <span />
        </button>
    );
}
