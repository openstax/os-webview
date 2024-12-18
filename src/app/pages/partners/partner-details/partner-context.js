import buildContext from '~/components/jsx-helpers/build-context';
import useReviews from '~/models/reviews';

// eslint-disable-next-line complexity
function useContextValue({id: partnerId, model, title, setTitle}) {
    const [ratings, postRating] = useReviews(partnerId);

    if (!ratings) {
        return {};
    }
    const [partnerName, summary, reviews] = [
        ratings.partnerName,
        {
            count: ratings.ratingCount,
            rating: ratings.averageRating.ratingAvg
        },
        ratings.reviews
    ];
    const reviewCount = reviews.reduce((a, b) => a + (b.status === 'Approved' ? 1 : 0), 0);
    const showInfoRequestForm = title !== '';
    const toggleForm = () => setTitle(title ? '' : 'Request information');

    return {
        partnerId,
        partnerName,
        summary,
        reviews,
        reviewCount,
        postRating,
        showInfoRequestForm,
        toggleForm,
        partnerType: ratings?.partnerType,
        books: model.books
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PartnerContextProvider
};
