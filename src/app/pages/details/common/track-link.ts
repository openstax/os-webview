import linkhelper from '~/helpers/link';
import userModel, {UserModelType} from '~/models/usermodel';
import type {TrackedMouseEvent} from '~/components/shell/router-helpers/use-link-handler';

let userInfo: Partial<UserModelType>;

userModel.load().then((i) => {
    userInfo = i;
});

// A confirmed-faculty account is what the rest of the site treats as an
// instructor, so a self-reported but unverified instructor files as a student.
export function downloadRole(user: Partial<UserModelType>) {
    return user.groups?.includes('Faculty') ? 'instructor' : 'student';
}

// eslint-disable-next-line complexity
export default function trackLink(event: TrackedMouseEvent, id?: string) {
    const el = linkhelper.validUrlClick(event);

    if (!el) {return;}

    const isResource = el.dataset.variant === 'resource';
    const trackThis =
        userInfo?.accounts_id &&
        el.dataset.track &&
        id;

    if (trackThis) {
        /* eslint-disable camelcase */
        event.trackingInfo = {
            book: id,
            account_uuid: userInfo.uuid as string,
            [isResource ? 'resource_name' : 'book_format']: el.dataset.track,
            contact_id: userInfo?.salesforce_contact_id,
            source: window.location.pathname,
            role: downloadRole(userInfo)
        };
        /* eslint-enable camelcase */
    }
}
