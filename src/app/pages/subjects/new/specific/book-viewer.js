import React from 'react';
import useSpecificSubjectContext from './context';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCaretUp} from '@fortawesome/free-solid-svg-icons/faCaretUp';
import {faCaretDown} from '@fortawesome/free-solid-svg-icons/faCaretDown';
import useAmazonAssociatesLink from '~/pages/details/common/get-this-title-files//amazon-associates-link';
import {usePrintCopyDialog} from '~/pages/details/common/get-this-title-files/options';
import useActiveElementContext, {ActiveElementContextProvider} from '~/contexts/active-element';
import useLanguageContext from '~/contexts/language';
import './book-viewer.scss';

const localizedTexts = {
    'en': {
        orderPrint: 'Order a print copy',
        getBook: 'Get the book',
        viewOnline: 'View online',
        downloadPdf: 'Download a PDF',
        instructorResources: 'Instructor resources',
        studentResources: 'Student resources'

    },
    'es': {
        orderPrint: 'Solicite una copia impresa',
        getBook: 'Consigue el libro',
        viewOnline: 'Ver en línea',
        downloadPdf: 'Descargar un PDF',
        instructorResources: 'Recursos del instructor',
        studentResources: 'Recursos para estudiantes'
    }
};

function useTranslation() {
    const {language} = useLanguageContext();

    return localizedTexts[language];
}

function PrintOption({bookInfo}) {
    const {onClick, PCDialog} = usePrintCopyDialog();
    const tr = useTranslation();
    const amazonDataLink = useAmazonAssociatesLink(bookInfo.slug);

    return (
        <a role="menuitem" href="open a dialog" onClick={onClick}>
            {tr.orderPrint}
            <PCDialog text={tr.orderPrint} amazonDataLink={amazonDataLink} />
        </a>
    );
}

function GetTheBookDropdown({bookInfo}) {
    const [isOpen, toggle] = useToggle();
    const activeElement = useActiveElementContext();
    const ref = React.useRef();
    const {slug} = bookInfo;
    const buttonId = `${slug}-ddb`;
    const menuId = `${slug}-ddm`;
    const webviewLink = bookInfo.webviewRexLink || bookInfo.webviewLink;
    const pdfLink = (bookInfo.highResolutionPdfUrl || bookInfo.lowResolutionPdfUrl);
    const tr = useTranslation();

    React.useLayoutEffect(
        () => {
            if (isOpen && !ref.current.contains(activeElement)) {
                toggle();
            }
        },
        [activeElement, isOpen, toggle]
    );

    return (
        <div className="navmenu" ref={ref}>
            <button
                id={buttonId} type="button" aria-haspopup="true" aria-controls={menuId}
                aria-isexpanded={isOpen} onClick={() => toggle()}
            >
                {tr.getBook}
                <FontAwesomeIcon icon={isOpen ? faCaretUp : faCaretDown} />
            </button>
            <div id={menuId} role="menu" aria-labelledby={buttonId}>
                <a role="menuitem" href={webviewLink}>{tr.viewOnline}</a>
                <a role="menuitem" href={pdfLink}>{tr.downloadPdf}</a>
                <PrintOption bookInfo={bookInfo} />
                <hr />
                <a role="menuitem" href={`/details/${slug}?Instructor resources`}>{tr.instructorResources}</a>
                <a role="menuitem" href={`/details/${slug}?Student resources`}>{tr.studentResources}</a>
            </div>
        </div>
    );
}

function Book({book: [book]}) {
    const {coverUrl, title, slug} = book;

    return (
        <div className="book-tile">
            <img src={coverUrl} role="presentation" />
            <div className="text-block">
                <a href={`/details/${slug}`}>{title}</a>
            </div>
            <GetTheBookDropdown bookInfo={book} />
        </div>
    );
}

function Category({category: [heading, categoryData]}) {
    const booksObj = categoryData.books;
    const books = Object.values(booksObj);
    const text = categoryData.categoryDescription;

    return (
        <div id={heading} className="category">
            <h2>{heading}</h2>
            <div>{text}</div>
            <div className="books">
                {books.map((b) => <Book key={b.id} book={b} />)}
            </div>
        </div>
    );
}

export default function BookViewer() {
    const {subjects, title} = useSpecificSubjectContext();
    const cats = Object.entries(subjects[title].categories);

    return (
        <ActiveElementContextProvider>
            <section className="book-viewer">
                <div className="content">
                    {cats.map((c) => <Category key={c[0]} category={c} />)}
                </div>
            </section>
        </ActiveElementContextProvider>
    );
}
