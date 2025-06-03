import React from 'react';
import useToggleContext, {
    ToggleContextProvider
} from '~/components/toggle/toggle-context';

export function useRefToFocusAfterClose() {
    const {isOpen} = useToggleContext();
    const [hasBeenOpened, setHasBeenOpened] = React.useState(false);
    const ref = React.useRef<HTMLDivElement>(null);

    React.useEffect(() => {
        if (isOpen) {
            setHasBeenOpened(true);
        } else if (hasBeenOpened) {
            ref.current?.focus();
        }
    }, [isOpen, hasBeenOpened]);

    return ref;
}

export function IfToggleIsOpen({children}: React.PropsWithChildren<object>) {
    const {isOpen} = useToggleContext();

    return isOpen && children;
}

export default function Toggle({children}: React.PropsWithChildren<object>) {
    return <ToggleContextProvider>{children}</ToggleContextProvider>;
}
