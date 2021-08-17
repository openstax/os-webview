import buildContext from '~/components/jsx-helpers/build-context';
import {useUserModel} from '~/models/usermodel';

function useContextValue() {
    const model = useUserModel();

    return (model && model.last_name) ? {
        accountId: model.id,
        userName: `${model.first_name} ${model.last_name.substr(0, 1)}.`
    } : {};
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as UserContextProvider
};
