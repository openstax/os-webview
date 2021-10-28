import React from 'react';
import useToggleContext, {ToggleContextProvider} from '~/components/toggle/toggle-context';

export function useRefToFocusAfterClose() {
    const {isOpen} = useToggleContext();
    const [hasBeenOpened, setHasBeenOpened] = React.useState(false);
    const ref = React.useRef();

    React.useEffect(() => {
        if (isOpen) {
            setHasBeenOpened(true);
        } else if (hasBeenOpened) {
            ref.current.focus();
        }
    }, [isOpen, hasBeenOpened]);

    return ref;
}

export function IfToggleIsOpen({children}) {
    const {isOpen} = useToggleContext();

    return isOpen && children;
}

export default function Toggle({children}) {
    return (
        <ToggleContextProvider>
            {children}
        </ToggleContextProvider>
    );
}
