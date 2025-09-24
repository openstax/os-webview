import React from 'react';
import useDropdownContext from '../dropdown-context';
import {useLocation} from 'react-router-dom';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import './menu-expander.scss';

function useCloseOnLocationChange(onClick: (event: object) => void, active: boolean) {
    const location = useLocation();
    const {setActiveDropdown} = useDropdownContext();
    const activeRef = React.useRef<boolean>();

    activeRef.current = active;

    React.useEffect(() => {
        if (activeRef.current) {
            onClick({});
            setActiveDropdown({});
        }
    }, [location, onClick, setActiveDropdown]);
}

type MenuExpanderProps = {
    active: boolean;
    onClick: (event: React.MouseEvent | React.KeyboardEvent | object) => void;
} & React.ButtonHTMLAttributes<HTMLButtonElement>;

export default function MenuExpander({active, onClick, ...props}: MenuExpanderProps) {
    const onClickAndBlur = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>) => {
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
            tabIndex={0}
            onClick={onClickAndBlur}
            onKeyDown={treatSpaceOrEnterAsClick}
            {...props}
        >
            <span />
        </button>
    );
}
