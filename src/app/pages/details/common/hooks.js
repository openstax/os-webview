import {useState, useRef, useEffect} from 'react';
import userModel from '~/models/usermodel';
import tableOfContentsHtml from '~/models/table-of-contents-html';
import partnerFeaturePromise, {tooltipText} from '~/models/salesforce-partners';
import shuffle from 'lodash/shuffle';

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
    return {
        image: partner.partner_logo,
        name: partner.partner_name,
        description: partner.short_partner_description,
        cost: partner.affordability_cost,
        type: partner.partner_type,
        url: `/partners?${partner.partner_name}`,
        verifiedFeatures: partner.verified_by_instructor ? tooltipText : false
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
