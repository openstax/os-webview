import React from 'react';
import { useToggle } from '~/helpers/data';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCaretUp } from '@fortawesome/free-solid-svg-icons/faCaretUp';
import { faCaretDown } from '@fortawesome/free-solid-svg-icons/faCaretDown';
import { FormattedMessage, useIntl } from 'react-intl';
import useAmazonAssociatesLink from '~/pages/details/common/get-this-title-files//amazon-associates-link';
import { usePrintCopyDialog, isRealPrintLink } from '~/pages/details/common/get-this-title-files/options';
import useActiveElementContext from '~/contexts/active-element';
import bookPromise from '~/models/book-titles';
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
    const activeElement = useActiveElementContext();
    const ref = React.useRef();
    const { slug } = bookInfo;
    const buttonId = `${slug}-ddb`;
    const menuId = `${slug}-ddm`;
    const webviewLink = bookInfo.webviewRexLink || bookInfo.webviewLink;
    const pdfLink =
        bookInfo.highResolutionPdfUrl || bookInfo.lowResolutionPdfUrl;

    React.useLayoutEffect(() => {
        if (isOpen && !ref.current.contains(activeElement)) {
            toggle();
        }
    }, [activeElement, isOpen, toggle]);

    return (
        <div className="navmenu" ref={ref}>
            <button
                id={buttonId}
                type="button"
                aria-haspopup="true"
                aria-controls={menuId}
                aria-expanded={isOpen}
                onClick={() => toggle()}
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
                    pdfLink &&
                    <a role="menuitem" href={pdfLink}>
                        <FormattedMessage
                            id="getit.pdf.download"
                            defaultMessage="Download a PDF"
                        />
                    </a>
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

function useBookState(id) {
    const [state, setState] = React.useState();

    React.useEffect(
        () => bookPromise.then(
            (items) => setState(items.find((i) => i.id === id)?.book_state)
        ),
        [id]
    );
    return state;
}

export default function BookTile({ book: [book] }) {
    const { coverUrl, title, slug } = book;
    const state = useBookState(book.id);
    const classes = cn({'book-tile': true, 'coming-soon': state === 'coming_soon'});

    return (
        <div className={classes}>
            <a href={`/details/${slug}`}>
                <img src={coverUrl} role="presentation" width="240" height="240" />
            </a>
            <div className="text-block">
                <a href={`/details/${slug}`}>{title}</a>
            </div>
            <GetTheBookDropdown bookInfo={book} />
        </div>
    );
}
