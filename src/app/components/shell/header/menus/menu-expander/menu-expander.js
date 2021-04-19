import React, {useEffect} from 'react';
import {DropdownContext} from '../dropdown-context';
import {useLocation} from 'react-router-dom';
import './menu-expander.scss';

export default function MenuExpander({active, onClick}) {
    const ref = React.useRef();
    const location = useLocation();
    const {setActiveDropdown} = React.useContext(DropdownContext);

    useEffect(() => {
        if (active) {
            onClick();
            setActiveDropdown({});
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location]);


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
