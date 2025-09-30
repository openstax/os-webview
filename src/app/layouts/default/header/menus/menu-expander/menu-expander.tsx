import React from 'react';
import useDropdownContext from '../dropdown-context';
import {useLocation} from 'react-router-dom';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './menu-expander.scss';

function useCloseOnLocationChange(toggleActive: (v?: boolean) => void, active: boolean) {
    const location = useLocation();
    const {setActiveDropdown} = useDropdownContext();
    const activeRef = React.useRef<boolean>();

    activeRef.current = active;

    React.useEffect(() => {
        if (activeRef.current) {
            toggleActive(false);
            setActiveDropdown({});
        }
    }, [location, toggleActive, setActiveDropdown]);
}

type MenuExpanderProps = {
    active: boolean;
    toggleActive: (v?: boolean) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function MenuExpander({active, toggleActive, ...props}: MenuExpanderProps) {
    const onClickAndBlur = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
            toggleActive();
            event.currentTarget.blur();
        },
        [toggleActive]
    );

    useCloseOnLocationChange(toggleActive, active);

    return (
        <button
            type="button"
            className="expand"
            aria-haspopup="true" aria-label="Toggle Meta Navigation Menu"
            tabIndex={0}
            onClick={onClickAndBlur}
            onKeyDown={treatSpaceOrEnterAsClick}
            {...props}
        >
            <span />
        </button>
    );
}
