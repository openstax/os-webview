import React from 'react';
import AssignableBadge from '~/components/assignable-badge/assignable-badge';
import { useToggle } from '~/helpers/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FormattedMessage, useIntl } from 'react-intl';
import useAmazonAssociatesLink from '~/pages/details/common/get-this-title-files//amazon-associates-link';
import { usePrintCopyDialog, isRealPrintLink } from '~/pages/details/common/get-this-title-files/options';
import bookPromise from '~/models/book-titles';
import useGiveDialog from '~/pages/details/common/get-this-title-files/give-before-pdf/give-before-pdf';
import {isMobileDisplay} from '~/helpers/device';
import cn from 'classnames';
import './book-tile.scss';

function PrintOption({ bookInfo }) {
    const { onClick, PCDialog } = usePrintCopyDialog();
    const amazonDataLink = useAmazonAssociatesLink(bookInfo.slug.replace('books/', ''));
    const { formatMessage } = useIntl();
    const text = formatMessage({
        id: 'getit.print',
        defaultMessage: 'Order a print copy'
    });

    if (!isRealPrintLink(amazonDataLink.url)) {
        return null;
    }

    return (
        <a role="menuitem" href="open a dialog" onClick={onClick}>
            {text}
            <PCDialog text={text} amazonDataLink={amazonDataLink} />
        </a>
    );
}

function GetTheBookDropdown({ bookInfo }) {
    const [isOpen, toggle] = useToggle();
    const ref = React.useRef();
    const { slug } = bookInfo;
    const buttonId = `${slug}-ddb`;
    const menuId = `${slug}-ddm`;
    const webviewLink = bookInfo.webviewRexLink || bookInfo.webviewLink;
    const pdfLink =
        bookInfo.highResolutionPdfUrl || bookInfo.lowResolutionPdfUrl;
    const toggleMenu = React.useCallback(
        () => {
            toggle();
        },
        [toggle]
    );

    // This is supposed to close it when another opens
    React.useEffect(() => {
        const outsideClick = (e) => {
            if (isOpen && !ref.current.contains(e.target)) {
                toggle();
            }
        };

        window.addEventListener('click', outsideClick);

        return () => window.removeEventListener('click', outsideClick);
    }, [isOpen, toggle]);

    return (
        <div className="navmenu" ref={ref}>
            <button
                id={buttonId}
                type="button"
                aria-haspopup="true"
                aria-controls={menuId}
                aria-expanded={isOpen}
                onClick={toggleMenu}
            >
                <FormattedMessage
                    id="getTheBook"
                    defaultMessage="Get the book"
                />
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
            </button>
            <div id={menuId} role="menu" aria-labelledby={buttonId}>
                <a role="menuitem" href={webviewLink}>
                    <FormattedMessage
                        id="getit.webview.link"
                        defaultMessage="View online"
                    />
                </a>
                {
                    pdfLink && <PDFLinkWithGiveDialog pdfLink={pdfLink} />
                }
                <PrintOption bookInfo={bookInfo} />
                <hr />
                <a
                    role="menuitem"
                    href={`/details/${slug}?Instructor resources`}
                >
                    <FormattedMessage
                        id="tabs.instructorResources"
                        defaultMessage="Instructor resources"
                    />
                </a>
                <a role="menuitem" href={`/details/${slug}?Student resources`}>
                    <FormattedMessage
                        id="tabs.studentResources"
                        defaultMessage="Student resources"
                    />
                </a>
            </div>
        </div>
    );
}

function PDFLinkWithGiveDialog({pdfLink}) {
    const {GiveDialog, open, enabled} = useGiveDialog();

    const openGiveDialog = React.useCallback(
        (event) => {
            if (enabled && !isMobileDisplay()) {
                event.preventDefault();
                open();
            }
        },
        [enabled, open]
    );

    return (
        <React.Fragment>
            <a role="menuitem" href={pdfLink} onClick={openGiveDialog}>
                <FormattedMessage
                    id="getit.pdf.download"
                    defaultMessage="Download a PDF"
                />
            </a>
            <GiveDialog link={pdfLink} />
        </React.Fragment>
    );
}

function useBookInfo(id) {
    const [state, setState] = React.useState();

    React.useEffect(
        () => bookPromise.then(
            (items) => setState(items.find((i) => i.id === id))
        ),
        [id]
    );
    return state;
}

export default function BookTile({ book: [book] }) {
    const { coverUrl, title, slug } = book;
    const info = useBookInfo(book.id);
    const comingSoon = info?.book_state === 'coming_soon';
    const assignable = info?.assignable_book === true;
    const classes = cn({'book-tile': true, 'coming-soon': comingSoon, assignable});

    return (
        <div className={classes}>
            <a href={`/details/${slug}`}>
                <img src={coverUrl} role="presentation" width="240" height="240" />
                {assignable && <AssignableBadge />}
            </a>
            <div className="text-block">
                <a href={`/details/${slug}`}>{title}</a>
            </div>
            <GetTheBookDropdown bookInfo={book} />
        </div>
    );
}
