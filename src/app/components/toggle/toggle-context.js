import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import buildContext from '~/components/jsx-helpers/build-context';

function useContextValue() {
    const [isOpen, toggle] = useToggle(false);

    return {isOpen, toggle};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as ToggleContextProvider
};
