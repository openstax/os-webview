import React from 'react';
import useUserContext from '~/contexts/user';
import {UserContextType} from '~/contexts/user-types';
import {FormattedMessage} from 'react-intl';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faLock} from '@fortawesome/free-solid-svg-icons/faLock';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import {faExclamationTriangle} from '@fortawesome/free-solid-svg-icons/faExclamationTriangle';
import {faExternalLinkAlt} from '@fortawesome/free-solid-svg-icons/faExternalLinkAlt';
import {useToggle} from '~/helpers/data';
import {UseToggleType} from '~helpers/data-types';
import linkHelper from '~/helpers/link';
import useDetailsContext from '../../context';
import CompCopyRequestForm from './request-form/request-form';
import Dialog from '~/components/dialog/dialog';
import CustomizationForm from '../customization-form/customization-form';

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
    const {userStatus}: UserContextType = useUserContext();
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
    const [timeIsUp, toggle] = useToggle(false) as UseToggleType;
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

function LeftButton({model}: {model: LeftContentModelType & LinkIsSet}) {
    const [isOpen, toggle] = useToggle(false) as UseToggleType;
    const isCompCopy = model.link.url.endsWith('comp-copy');
    const isCustomization = model.link.url.endsWith('customized-modules');
    const icon =
        {
            lock: faLock,
            download: faDownload,
            'external-link-alt': faExternalLinkAlt
        }[model.iconType] || faExclamationTriangle;
    const {userModel}: UserContextType = useUserContext();

    function openDialog(event: TrackedMouseEvent) {
        if (isCompCopy || isCustomization) {
            event.preventDefault();
            toggle();
        } else if (model.bookModel) {
            interceptLinkClicks(event, model.bookModel.id, userModel);
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
            {isCompCopy && <IbooksDialog {...{model, isOpen, toggle}} />}
            {isCustomization && <CustomizationDialog {...{isOpen, toggle}} />}
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
    userModel: UserContextType['userModel']
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

type IbooksDialogArgs = {
    model: LeftContentModelType;
    isOpen: boolean;
    toggle: UseToggleType[1];
};

function IbooksDialog({model, isOpen, toggle}: IbooksDialogArgs) {
    const bookModel = useDetailsContext();

    if (!('bookModel' in model)) {
        // When useDetailsContext is converted to TS, this casts should be unnecessary
        model.bookModel = bookModel as LeftContentModelType['bookModel'];
    }

    function done(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    }

    return (
        <Dialog
            isOpen={isOpen}
            onPutAway={toggle}
            title='Request a complimentary iBooks title'
        >
            <CompCopyRequestForm model={model} done={done} />
        </Dialog>
    );
}

function CustomizationDialog({
    isOpen,
    toggle
}: {
    isOpen: boolean;
    toggle: UseToggleType[1];
}) {
    const bookModel =
        useDetailsContext() as Required<LeftContentModelType>['bookModel'];

    function done(event: React.MouseEvent) {
        event.preventDefault();
        event.stopPropagation();
        toggle();
    }

    return (
        <Dialog
            isOpen={isOpen}
            onPutAway={toggle}
            title={bookModel.customizationFormHeading}
        >
            <CustomizationForm model={bookModel} done={done} />
        </Dialog>
    );
}
