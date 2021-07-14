import React, {useEffect} from 'react';
import TOCContext, {useTocState} from './common/toc-slideout/context';
import TOCSlideout from './common/toc-slideout/toc-slideout';
import ContextLoader from '~/components/jsx-helpers/context-loader';
import $ from '~/helpers/$';
import analytics from '~/helpers/analytics';
import cn from 'classnames';
import PhoneView from './phone-view/phone-view';
import DesktopView from './desktop-view/desktop-view';
import {useTableOfContents} from './common/hooks';
import DetailsContext, {useContextValue} from './context';
import './details.scss';
import './table-of-contents.scss';

// import getCompCopyDialogProps from './comp-copy-dialog-props';

function setPageColor(color) {
    document.querySelector('.details-page').classList.add(color);
}

function setJsonLd(data) {
    const el = document.createElement('script');
    const authorData = data.authors.map((obj) => ({
        '@type': 'Person',
        'name': obj.name,
        'affiliation': obj.university
    }));
    const polish = $.isPolish(data.title);
    const ldData = {
        '@content': 'https://schema.org',
        '@type': 'WebPage',
        'datePublished': data.created,
        'dateModified': data.updated,
        'mainEntity': {
            'type': 'Book',
            'name': data.title,
            'author': authorData,
            'publisher': {
                'type': 'Organization',
                'name': 'OpenStax'
            },
            'image': data.coverUrl,
            'inLanguage': polish ? 'Polish' : 'English',
            'isbn': data.digitalIsbn13,
            'url': data.rexWebviewLink || data.webviewLink
        }
    };
    const descriptionEl = document.querySelector('head meta[name="description"]');

    if (descriptionEl) {
        el.type = 'application/ld+json';
        el.textContent = JSON.stringify(ldData, null, 2);
        descriptionEl.parentNode.insertBefore(el, descriptionEl.nextSibling);
    }
}


function TitleImage({titleImage, bookTitle, titleLogo}) {
    return (
        <h1 className="image-heading">
            <img className="title-image" src={titleImage} alt={bookTitle} />
            {titleLogo && <img className="title-logo" src={titleLogo} alt="" />}
        </h1>
    );
}

function setCardBackground(isShowingCards) {
    const el = document.querySelector('.details-page');

    el.classList[isShowingCards ? 'add' : 'remove']('card-background');
}

function TocSlideoutAndContent({children}) {
    const tocState = useTocState();
    const model = React.useContext(DetailsContext);
    const cwClass = cn('content-wrapper', {'drawer-open': tocState.isOpen});
    const tocHtml = useTableOfContents(model);

    return (
        <TOCContext.Provider value={tocState}>
            <div className={cwClass} data-slug={model.slug}>
                <TOCSlideout html={tocHtml} />
                <div className="content">
                    {children}
                </div>
            </div>
        </TOCContext.Provider>
    );
}

export function BookDetails() {
    const model = React.useContext(DetailsContext);

    const {
        reverseGradient,
        title: bookTitle,
        titleImageUrl: titleImage
    } = model;
    const titleLogo = ''; // For future use

    useEffect(() => {
        setPageColor(model.coverColor);
        setJsonLd(model);
        analytics.addResourcesToLookupTable(model);
    }, [model]);

    return (
        <React.Fragment>
            <div className={cn('hero', {'reverse-gradient': reverseGradient})}>
                <div className="content book-title">
                    {titleImage && <TitleImage {...{titleImage, bookTitle, titleLogo}} />}
                </div>
            </div>
            <TocSlideoutAndContent>
                <div className="phone-view">
                    <PhoneView />
                </div>
                <div className="bigger-view">
                    <DesktopView onContentChange={setCardBackground} />
                </div>
            </TocSlideoutAndContent>
        </React.Fragment>
    );
}

function getSlugFromLocation() {
    const bookTitle = window.location.pathname.replace(/.*details\//, '');
    let slug;

    if ((/^books/).test(bookTitle)) {
        slug = bookTitle;
    } else {
        slug = `books/${bookTitle}`;
    }
    // Special handling for books whose slugs have changed
    if ((/university-physics$/).test(slug)) {
        slug += '-volume-1';
    }

    return slug;
}

export default function BookDetailsLoader() {
    return (
        <main className="details-page">
            <ContextLoader
                Context={DetailsContext}
                slug={getSlugFromLocation()}
                useContextValue={useContextValue}
                doDocumentSetup
            >
                <BookDetails />
            </ContextLoader>
        </main>
    );
}
