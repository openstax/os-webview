import React, {createContext, useContext} from 'react';
import useReviews from '~/models/reviews';

const PartnerContext = createContext();

export default PartnerContext;

// eslint-disable-next-line complexity
function usePartnerContext(partnerId) {
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

    return {
        partnerId,
        partnerName,
        summary,
        reviews,
        postRating
    };
}

export function PartnerContextProvider({partnerId, children}) {
    return (
        <PartnerContext.Provider value={usePartnerContext(partnerId)}>
            {children}
        </PartnerContext.Provider>
    );
}
