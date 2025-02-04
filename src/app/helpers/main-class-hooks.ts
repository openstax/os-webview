import React from 'react';
import useMainClassContext from '~/contexts/main-class';

function useOnAndOff(setter: (state: boolean) => void) {
    React.useEffect(
        () => {
            setter(true);

            return () => setter(false);
        },
        [setter]
    );
}

export function useMainSticky() {
    const {setSticky} = useMainClassContext();

    useOnAndOff(setSticky);
}

export function useMainModal() {
    const {setModal} = useMainClassContext();

    useOnAndOff(setModal);
}
