import React from 'react';
import useUserContext from '~/contexts/user';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {useToggle} from '~/helpers/data';
import {useLocation} from 'react-router-dom';
import trackLink from '../track-link';
import {itemTypeForVariant} from '../get-this-title-files/give-before-pdf/give-before-other';
import useGiveDialog, { VariantValue } from '../get-this-title-files/give-before-pdf/use-give-dialog';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {TrackedMouseEvent} from '~/components/shell/router-helpers/use-link-handler';
import {ResourceModel} from './resource-boxes';

// ResourceModel & LinkIsSet changes link from optional to required.
type LinkIsSet = {
    link: {url: string; text: string};
};

// eslint-disable-next-line complexity
export default function LeftContent({model, variant}: {model: ResourceModel; variant?: VariantValue}) {
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

    return <LeftButton model={model as ResourceModel & LinkIsSet} variant={variant} />;
}

function useDoneWaitingForModelChange(model: ResourceModel) {
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

// Callers that render a resource box outside the book detail page (e.g. a
// flex-page table cell) pass an explicit variant instead - the route's query
// string says nothing about the resource there.
function useVariant(): VariantValue {
    const {search} = useLocation();

    if (search.includes('Instructor')) {
        return 'Instructor resource';
    }
    if (search.includes('Student')) {
        return 'Student resource';
    }
    return '? resource';
}

function LinkText({iconType, link}: LinkIsSet & {iconType: ResourceModel['iconType']}) {
    if (iconType === 'lock') {
        return <FormattedMessage id="resources.loginToUnlock" />;
    }
    return link.text;
}

function LeftButton({model, variant}: {model: ResourceModel & LinkIsSet; variant?: VariantValue}) {
    const icon = iconLookup[model.iconType] || faExclamationTriangle;
    const isDownload = icon === faDownload;
    const {GiveDialog, open, enabled} = useGiveDialog();
    // trackLink reports for any signed-in account. Gating on instructor status
    // here dropped every student's resource download, and dropped an
    // instructor's too whenever the click beat the user request.
    const trackDownloadClick = React.useCallback(
        (event: TrackedMouseEvent) => {
            // A malformed CMS resource can reach the exclamation-icon fallback
            // with no book attached; trackLink treats a missing id as
            // "nothing to report", and throwing here would abort the click
            // before the resource opens.
            trackLink(event, model.bookModel?.id.toString());
        },
        [model.bookModel]
    );
    const routeVariant = useVariant();
    const nudgeVariant = variant ?? routeVariant;
    const ariaLabel = isDownload ? `Download ${model.heading}` : `Go to ${model.heading}`;

    function openDialog(event: TrackedMouseEvent) {
        // The donation nudge is for downloads only, but every resource counts as
        // a resource access — link-icon resources (Canvas cartridges, OER
        // Commons items) have to report too.
        if (isDownload && enabled && open()) {
            event.preventDefault();
            return;
        }
        // The dialog's own link is what normally reports the download, so a
        // skipped dialog has to report it here or the CMS never sees it.
        trackDownloadClick(event);
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
                data-variant={itemTypeForVariant(nudgeVariant)}
                aria-label={ariaLabel}
            >
                <FontAwesomeIcon icon={icon} />
                <span><LinkText iconType={model.iconType} link={model.link} /></span>
            </a>
            {isDownload && (
                <GiveDialog
                    link={model.link.url}
                    track={model.heading}
                    onDownload={
                        trackDownloadClick as (
                            e: React.MouseEvent
                        ) => void
                    }
                    variant={nudgeVariant}
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
