import React from 'react';
import useDropdownContext from '../dropdown-context';
import {useLocation} from 'react-router-dom';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './menu-expander.scss';

function useCloseOnLocationChange(onClick, active) {
    const location = useLocation();
    const {setActiveDropdown} = useDropdownContext();
    const activeRef = React.useRef();

    activeRef.current = active;

    React.useEffect(() => {
        if (activeRef.current) {
            onClick({});
            setActiveDropdown({});
        }
    }, [location, onClick, setActiveDropdown]);
}

export default function MenuExpander({active, onClick, ...props}) {
    const onClickAndBlur = React.useCallback(
        (event) => {
            onClick(event);
            event.currentTarget.blur();
        },
        [onClick]
    );

    useCloseOnLocationChange(onClick, active);

    return (
        <button
            type="button"
            className="expand"
            aria-haspopup="true" aria-label="Toggle Meta Navigation Menu"
            tabIndex="0"
            onClick={onClickAndBlur}
            onKeyDown={treatSpaceOrEnterAsClick}
            {...props}
        >
            <span />
        </button>
    );
}
