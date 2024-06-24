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
import useGiveDialog, { VariantValue } from '../get-this-title-files/give-before-pdf/use-give-dialog';
import {IconDefinition} from '@fortawesome/fontawesome-svg-core';
import {TrackedMouseEvent} from '~/components/shell/router-helpers/use-link-handler';

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

function LeftButton({model}: {model: LeftContentModelType & LinkIsSet}) {
    const icon = iconLookup[model.iconType] || faExclamationTriangle;
    const isDownload = icon === faDownload;
    const {GiveDialog, open, enabled} = useGiveDialog();
    const {userStatus} = useUserContext();
    const trackDownloadClick = React.useCallback(
        (event: TrackedMouseEvent) => {
            if (userStatus?.isInstructor) {
                trackLink(event, model.bookModel?.id);
            }
        },
        [model.bookModel, userStatus]
    );
    const variant = useVariant();
    const ariaLabel = isDownload ? `Download ${model.heading}` : `Go to ${model.heading}`;

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
                aria-label={ariaLabel}
            >
                <FontAwesomeIcon icon={icon} />
                <span>{model.link.text}</span>
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
                    variant={variant}
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
