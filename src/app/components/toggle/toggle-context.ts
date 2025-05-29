import {useMemo} from 'react';
import {useToggle} from '~/helpers/data';
import buildContext from '~/components/jsx-helpers/build-context';
import throttle from 'lodash/throttle';

function useContextValue() {
    const [isOpen, toggle] = useToggle(false);

    // Multiple events might try to toggle the same direction and cancel each
    // other out. This throws away the later calls within 1/8 second.
    const dbToggle = useMemo(
        () => throttle(toggle, 125, {trailing: false}),
        [toggle]
    );

    return {isOpen, toggle: dbToggle, close: () => dbToggle(false)};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as ToggleContextProvider};
