import buildContext from '~/components/jsx-helpers/build-context';
import useReviews from '~/models/reviews';

// eslint-disable-next-line complexity
function useContextValue(partnerId) {
    const [ratings, postRating] = useReviews(partnerId);
    const [partnerName, summary, reviews] = ratings ?
        [
            ratings.partnerName,
            {
                count: ratings.ratingCount,
                rating: ratings.averageRating.ratingAvg
            },
            ratings.reviews
        ] : [
            null,
            {},
            []
        ];
    const reviewCount = reviews.reduce((a, b) => a + (b.status === 'Approved' ? 1 : 0), 0);

    return {
        partnerId,
        partnerName,
        summary,
        reviews,
        reviewCount,
        postRating
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as PartnerContextProvider
};
