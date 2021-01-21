import React, {createContext, useContext} from 'react';
import useReviews from '~/models/reviews';

const PartnerContext = createContext();

export default PartnerContext;

// eslint-disable-next-line complexity
function usePartnerContext(partnerId, onUpdate) {
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

    React.useEffect(() => {
        onUpdate(summary);
    }, [summary]);

    return {
        partnerId,
        partnerName,
        summary,
        reviews,
        postRating
    };
}

export function PartnerContextProvider({partnerId, onUpdate, children}) {
    return (
        <PartnerContext.Provider value={usePartnerContext(partnerId, onUpdate)}>
            {children}
        </PartnerContext.Provider>
    );
}
