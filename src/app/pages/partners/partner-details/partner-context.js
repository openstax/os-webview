import buildContext from '~/components/jsx-helpers/build-context';
import usePartnerInfo from '~/models/partner-info';


function useContextValue({id: partnerId, model, title, setTitle}) {
    const info = usePartnerInfo(partnerId);

    if (!info) {
        return {};
    }
    const {partnerName} = info;
    const showInfoRequestForm = title !== '';
    const toggleForm = () => setTitle(title ? '' : 'Request information');

    return {
        partnerId,
        partnerName,
        showInfoRequestForm,
        toggleForm,
        partnerType: info.partnerType,
        books: model.books
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PartnerContextProvider
};
