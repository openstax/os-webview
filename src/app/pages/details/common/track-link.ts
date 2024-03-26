import linkhelper from '~/helpers/link';
import userModel, {UserModelType} from '~/models/usermodel';
import type {TrackedMouseEvent} from '~/components/shell/router-helpers/useLinkHandler';

let userInfo: UserModelType;

userModel.load().then((i) => {
    userInfo = i;
});

export default function trackLink(event: TrackedMouseEvent, id?: string) {
    const el = linkhelper.validUrlClick(event);
    const isResource = el.dataset?.variant === 'resource';
    const trackThis =
        userInfo?.accounts_id &&
        el?.dataset?.track &&
        id;

    if (trackThis) {
        /* eslint-disable camelcase */
        event.trackingInfo = {
            book: id,
            account_uuid: userInfo.uuid,
            [isResource ? 'resource_name' : 'book_format']: el.dataset.track,
            contact_id: userInfo?.salesforce_contact_id
        };
        /* eslint-enable camelcase */
    }
}
