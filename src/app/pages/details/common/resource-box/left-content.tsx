import React from 'react';
import useUserContext from '~/contexts/user';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {useToggle} from '~/helpers/data';
import linkHelper from '~/helpers/link';
import useGiveDialog from '../get-this-title-files/give-before-pdf/give-before-pdf';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';

type LeftContentModelType = {
    link?: {url?: string; text?: string};
    comingSoon: boolean;
    iconType: string;
    bookModel?: {id: string; customizationFormHeading: string};
    heading: string;
    resourceCategory?: string;
};

type LinkIsSet = {
    link: {url: string; text: string};
};

type TrackedMouseEvent = React.MouseEvent<HTMLAnchorElement, MouseEvent> & {
    trackingInfo: object;
};

// eslint-disable-next-line complexity
export default function LeftContent({model}: {model: LeftContentModelType}) {
    const {userStatus} = useUserContext();
    const doneWaiting = useDoneWaitingForModelChange(model);

    if (!model.link) {
        return <AccessPending />;
    }

    if (!model.link.url) {
        return doneWaiting && !model.comingSoon ? <MissingLink /> : null;
    }

    // logged in but not an instructor
    if (model.iconType === 'lock' && userStatus?.isInstructor === false) {
        return (
            <div className='left-no-button'>
                <FontAwesomeIcon icon={faLock} />
                <FormattedMessage
                    id='resources.available'
                    defaultMessage='Only available for verified instructors.'
                />
            </div>
        );
    }

    return <LeftButton model={model as LeftContentModelType & LinkIsSet} />;
}

function useDoneWaitingForModelChange(model: LeftContentModelType) {
    const [timeIsUp, toggle] = useToggle(false);
    const timerRef = React.useRef<number>();

    React.useEffect(() => {
        window.clearTimeout(timerRef.current);
        toggle(false);
        timerRef.current = window.setTimeout(() => toggle(true), 250);
    }, [model, toggle]);

    return timeIsUp;
}

function AccessPending() {
    return (
        <span className='left'>
            <FontAwesomeIcon icon={faLock} />
            <span>Access Pending</span>
        </span>
    );
}

const iconLookup: {[key: string]: IconDefinition} = {
    lock: faLock,
    download: faDownload,
    'external-link-alt': faExternalLinkAlt
};

type UseGiveDialogTypes = {
    GiveDialog: ({link, onDownload}: {
        link: string;
        onDownload: (event: TrackedMouseEvent) => void;
    }) => React.JSX.Element;
    open: () => null;
    enabled: boolean;
};

function LeftButton({model}: {model: LeftContentModelType & LinkIsSet}) {
    const icon = iconLookup[model.iconType] || faExclamationTriangle;
    const isDownload = icon === faDownload;
    const {userModel} = useUserContext();
    const {GiveDialog, open, enabled} = useGiveDialog() as UseGiveDialogTypes;
    const trackDownloadClick = React.useCallback((event: TrackedMouseEvent) => {
        if (model.bookModel) {
            interceptLinkClicks(event, model.bookModel.id, userModel);
        }
    }, [model.bookModel, userModel]);

    function openDialog(event: TrackedMouseEvent) {
        if (isDownload && enabled) {
            event.preventDefault();
            open();
        }
    }

    return (
        <React.Fragment>
            <a
                className='left-button'
                href={model.link.url}
                data-local={model.iconType === 'lock'}
                onClick={openDialog}
                data-track={model.heading}
                data-analytics-select-content={model.heading}
                data-content-type={`Book Resource (${model.resourceCategory})`}
            >
                <FontAwesomeIcon icon={icon} />
                <span>{model.link.text}</span>
            </a>
            {isDownload && (
                <GiveDialog
                    link={model.link.url}
                    onDownload={trackDownloadClick}
                />
            )}
        </React.Fragment>
    );
}

function MissingLink() {
    return (
        <span className='left missing-link'>
            <FontAwesomeIcon icon={faExclamationTriangle} />
            <span>MISSING LINK</span>
        </span>
    );
}

// Adapted from get-this-title interceptLinkClicks
function interceptLinkClicks(
    event: TrackedMouseEvent,
    book: string,
    userModel: ReturnType<typeof useUserContext>['userModel']
) {
    const el = linkHelper.validUrlClick(event);

    if (!el) {
        return;
    }
    const trackThis = userModel?.accounts_id && el.dataset.track;

    if (trackThis) {
        /* eslint-disable camelcase */
        event.trackingInfo = {
            book,
            account_uuid: userModel.uuid,
            resource_name: el.dataset.track,
            contact_id: userModel.salesforce_contact_id
        };
        /* eslint-enable camelcase */
    }
}
