import buildContext from '~/components/jsx-helpers/build-context';
import usePartnerInfo from '~/models/partner-info';
import type {LinkTexts, PartnerEntry} from '../results/results';

export type Model = Omit<PartnerEntry, 'id'> & LinkTexts & {
    verifiedFeatures?: string;
};

function useContextValue({id: partnerId, model, title, setTitle}: {
    id: number;
    model: Model;
    title: string;
    setTitle: React.Dispatch<React.SetStateAction<string>>;
}) {
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
