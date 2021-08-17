import buildContext from '~/components/jsx-helpers/build-context';
import {useUserModel as useContextValue} from '~/models/usermodel';

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as UserContextProvider
};
