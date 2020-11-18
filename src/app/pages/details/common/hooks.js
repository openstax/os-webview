import {useState, useRef, useEffect} from 'react';
import userModel from '~/models/usermodel';
import tableOfContentsHtml from '~/models/table-of-contents-html';
import partnerFeaturePromise, {tooltipText} from '~/models/salesforce-partners';
import shuffle from 'lodash/shuffle';
import $ from '~/helpers/$';

export function useTableOfContents(model) {
    const isTutor = model.webviewRexLink.includes('tutor');
    const isRex = !isTutor && Boolean(model.webviewRexLink);
    const webviewLink = model.webviewRexLink || model.webviewLink;
    const [tocHtml, setTocHtml] = useState('');

    tableOfContentsHtml({
        isRex,
        cnxId: model.cnxId,
        bookSlug: model.slug,
        webviewLink,
        isTutor
    }).then(
        setTocHtml,
        (err) => {
            console.warn(`Failed to generate table of contents HTML for ${model.cnxId}: ${err}`);
        }
    );

    return tocHtml;
}

function getUserStatusPromise() {
    const isInstructor = (user) => {
        return user && user.username && 'groups' in user && user.groups.includes('Faculty');
    };
    const isStudent = (user) => {
        return user && user.username && !isInstructor(user);
    };

    return userModel.load().then((user) => {
        if (!user || Reflect.ownKeys(user).length === 0) {
            console.debug('No user info retrieved');
        } else if (!('pending_verification' in user)) {
            console.debug('No pending_verification flag set in user info', user);
        } else {
            console.debug('User info:', {
                email: user.email,
                pendingVerification: user.pending_verification,
                groups: user.groups
            });
        }

        return {
            isInstructor: isInstructor(user),
            isStudent: isStudent(user),
            pendingVerification: user.pending_verification,
            firstName: user.first_name,
            lastName: user.last_name,
            email: user.email,
            userInfo: user
        };
    });
}

export function useUserStatus() {
    const [userStatus, updateUserStatus] = useState();

    useEffect(() => {
        getUserStatusPromise().then(updateUserStatus);
    }, []);

    return userStatus;
}

function toBlurb(partner) {
    const pData = $.camelCaseKeys(partner);

    return {
        id: pData.id,
        image: pData.partnerLogo,
        name: pData.partnerName,
        description: pData.shortPartnerDescription,
        cost: pData.affordabilityCost,
        type: pData.partnerType,
        url: `/partners?${pData.partnerName}`,
        verifiedFeatures: pData.verifiedByInstructor ? tooltipText : false,
        rating: pData.averageRating.ratingAvg,
        ratingCount: pData.ratingCount
    };
}

export function usePartnerFeatures(bookAbbreviation) {
    const [blurbs, setBlurbs] = useState([]);
    const [includePartners, setIncludePartners] = useState('');

    useEffect(() => {
        partnerFeaturePromise.then((pd) =>
            pd.filter((p) => {
                const books = (p.books || '').split(';');

                return books.includes(bookAbbreviation);
            })
        ).then((pd) => {
            if (pd.length > 0) {
                setIncludePartners('include-partners');
            }
            setBlurbs(shuffle(pd).map(toBlurb));
        });
    }, [bookAbbreviation]);

    return [blurbs, includePartners];
}
