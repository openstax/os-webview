import React, { AnchorHTMLAttributes } from 'react';
import useAmazonAssociatesLink from '~/pages/details/common/get-this-title-files//amazon-associates-link';
import {
    usePrintCopyDialog,
    isRealPrintLink
} from '~/pages/details/common/get-this-title-files/options';
import {FormattedMessage, useIntl} from 'react-intl';
import useGiveDialog from '~/pages/details/common/get-this-title-files/give-before-pdf/give-before-pdf';
import {isMobileDisplay} from '~/helpers/device';
import {useToggle} from '~/helpers/data';
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

    return (
        <div className='navmenu' ref={ref}>
            <ControlButton
                parentRef={ref}
                buttonId={buttonId}
                menuId={menuId}
            />
            <div id={menuId} role='menu' aria-labelledby={buttonId}>
                <MenuItem
                    defaultMessage='View online'
                    url={webviewLink}
                    messageId='getit.webview.link'
                />
                {pdfLink && <PDFLinkWithGiveDialog pdfLink={pdfLink} />}
                <PrintOption slug={bookInfo.slug} />
                <hr />
                <MenuItem
                    defaultMessage='Instructor resources'
                    url={`/details/${slug}?Instructor resources`}
                    messageId='tabs.instructorResources'
                />
                <MenuItem
                    defaultMessage='Student resources'
                    url={`/details/${slug}?Student resources`}
                    messageId='tabs.studentResources'
                />
            </div>
        </div>
    );
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
            type='button'
            aria-haspopup='true'
            aria-controls={menuId}
            aria-expanded={isOpen}
            onClick={toggleMenu}
        >
            <FormattedMessage id='getTheBook' defaultMessage='Get the book' />
            <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
        </button>
    );
}

function MenuItem({
    defaultMessage,
    url,
    messageId,
    ...aProps
}: {
    defaultMessage: string;
    url: string;
    messageId: string;
} & AnchorHTMLAttributes<HTMLAnchorElement>) {
    return (
        <a role='menuitem' href={url} {...aProps}>
            <FormattedMessage id={messageId} defaultMessage={defaultMessage} />
        </a>
    );
}

function PDFLinkWithGiveDialog({pdfLink}: {pdfLink: string}) {
    const {GiveDialog, open, enabled} = useGiveDialog();

    const openGiveDialog = React.useCallback(
        (event: React.MouseEvent) => {
            if (enabled && !isMobileDisplay()) {
                event.preventDefault();
                open();
            }
        },
        [enabled, open]
    );

    return (
        <React.Fragment>
            <MenuItem
                defaultMessage='Download a PDF'
                url={pdfLink}
                messageId='getit.pdf.download'
                onClick={openGiveDialog}
            />
            <GiveDialog link={pdfLink} />
        </React.Fragment>
    );
}

function PrintOption({slug}: {slug: string}) {
    const {onClick, PCDialog} = usePrintCopyDialog();
    const amazonDataLink = useAmazonAssociatesLink(slug.replace('books/', ''));
    const {formatMessage} = useIntl();
    const text = formatMessage({
        id: 'getit.print',
        defaultMessage: 'Order a print copy'
    });

    if (!isRealPrintLink(amazonDataLink.url)) {
        return null;
    }

    return (
        <a role='menuitem' href='open a dialog' onClick={onClick}>
            {text}
            <PCDialog text={text} amazonDataLink={amazonDataLink} />
        </a>
    );
}
