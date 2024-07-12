import React, {AnchorHTMLAttributes} from 'react';
import {
    usePrintCopyDialog
} from '~/pages/details/common/get-this-title-files/options';
import {FormattedMessage, useIntl} from 'react-intl';
import {
    useOpenGiveDialog,
    VariantValue
} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-give-dialog';
import {useToggle} from '~/helpers/data';
import { fetchAllBooks } from '~/models/books';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons/faCaretUp';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import type {Book as BookInfo} from '~/pages/subjects/new/specific/context';

export default function GetTheBookDropdown({bookInfo}: {bookInfo: BookInfo}) {
    const ref = React.useRef<HTMLDivElement>(null);
    const {slug} = bookInfo;
    const buttonId = `${slug}-ddb`;
    const menuId = `${slug}-ddm`;
    const webviewLink = bookInfo.webviewRexLink || bookInfo.webviewLink;
    const pdfLink =
        bookInfo.highResolutionPdfUrl || bookInfo.lowResolutionPdfUrl;
    const warning = useWarning(bookInfo.id);

    return (
        <div
            className="navmenu"
            ref={ref}
            data-analytics-nav="Get the book dropdown"
        >
            <ControlButton
                parentRef={ref}
                buttonId={buttonId}
                menuId={menuId}
            />
            <div id={menuId} role="menu" aria-labelledby={buttonId}>
                <MenuItemWithGiveDialog
                    defaultMessage="View online"
                    url={webviewLink}
                    variant="View online"
                    warning={warning}
                    id={bookInfo.id.toString()}
                />
                <MenuItemWithGiveDialog
                    defaultMessage="Download a PDF"
                    url={pdfLink}
                    warning={warning}
                    id={bookInfo.id.toString()}
                />
                <PrintOption slug={bookInfo.slug} />
                <hr />
                <MenuItem
                    defaultMessage="Instructor resources"
                    url={`/details/${slug}?Instructor resources`}
                />
                <MenuItem
                    defaultMessage="Student resources"
                    url={`/details/${slug}?Student resources`}
                />
            </div>
        </div>
    );
}

function useWarning(id: number) {
    const [text, setText] = React.useState('');

    React.useEffect(
        () => {
            fetchAllBooks.then((books) => {
                const entry = books.find((b) => b.id === id);

                if (entry?.content_warning_text) {
                    setText(entry.content_warning_text);
                }
            });
        },
        [id]
    );

    return text;
}

function ControlButton({
    parentRef,
    buttonId,
    menuId
}: {
    parentRef: React.RefObject<HTMLDivElement>;
    buttonId: string;
    menuId: string;
}) {
    const [isOpen, toggle] = useToggle();
    const toggleMenu = React.useCallback(() => {
        toggle();
    }, [toggle]);

    // This is supposed to close it when another opens
    React.useEffect(() => {
        const outsideClick = (e: MouseEvent) => {
            if (isOpen && !parentRef.current?.contains(e.target as Node)) {
                toggle();
            }
        };

        window.addEventListener('click', outsideClick);

        return () => window.removeEventListener('click', outsideClick);
    }, [isOpen, toggle, parentRef]);

    return (
        <button
            id={buttonId}
            type="button"
            aria-haspopup="true"
            aria-controls={menuId}
            aria-expanded={isOpen}
            onClick={toggleMenu}
        >
            <FormattedMessage id="getTheBook" defaultMessage="Get the book" />
            <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
        </button>
    );
}

// FormattedMessage requires static literals for its params
type DefaultMessage =
    | 'View online'
    | 'Download a PDF'
    | 'Instructor resources'
    | 'Student resources';
function FormattedMessageFor({
    defaultMessage
}: {
    defaultMessage: DefaultMessage;
}) {
    if (defaultMessage === 'View online') {
        return (
            <FormattedMessage
                id="getit.webview.link"
                defaultMessage="View online"
            />
        );
    }
    if (defaultMessage === 'Download a PDF') {
        return (
            <FormattedMessage
                id="getit.pdf.download"
                defaultMessage="Download a PDF"
            />
        );
    }
    if (defaultMessage === 'Instructor resources') {
        return (
            <FormattedMessage
                id="tabs.instructorResources"
                defaultMessage="Instructor resources"
            />
        );
    }
    return (
        <FormattedMessage
            id="tabs.studentResources"
            defaultMessage="Student resources"
        />
    );
}

function MenuItem({
    defaultMessage,
    url,
    ...aProps
}: {
    defaultMessage: DefaultMessage;
    url: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a role="menuitem" href={url} {...aProps}>
            <FormattedMessageFor defaultMessage={defaultMessage} />
        </a>
    );
}


type MenuItemWithGiveDialogProps = {
    variant?: VariantValue;
    warning: string;
    id: string;
} & Parameters<typeof MenuItem>[0];
function MenuItemWithGiveDialog({
    variant,
    warning,
    id,
    ...props
}: MenuItemWithGiveDialogProps) {
    const {GiveDialog, openGiveDialog} = useOpenGiveDialog();

    return (
        <React.Fragment>
            <MenuItem {...props} onClick={openGiveDialog} />
            <GiveDialog link={props.url} variant={variant} warning={warning} id={id} />
        </React.Fragment>
    );
}

function PrintOption({slug}: {slug: string}) {
    const {onClick, PCDialog} = usePrintCopyDialog();
    const {formatMessage} = useIntl();
    const text = formatMessage({
        id: 'getit.print',
        defaultMessage: 'Order a print copy'
    });

    return (
        <a role="menuitem" href="open a dialog" onClick={onClick}>
            {text}
            <PCDialog text={text} slug={slug} />
        </a>
    );
}
