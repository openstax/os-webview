import buildContext from '~/components/jsx-helpers/build-context';
import {useToggle} from '~/helpers/data';

function useContextValue() {
    const [showUpdateForm, togglePage] = useToggle(false);

    return {showUpdateForm, togglePage};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PageContextProvider
};
