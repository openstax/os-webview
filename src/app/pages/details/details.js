import React, {useRef, useEffect} from 'react';
import {LoaderPage, useToggle, RawHTML, useCanonicalLink} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import $ from '~/helpers/$';
import analytics from '~/helpers/analytics';
import cn from 'classnames';
import PhoneView from './phone-view/phone-view';
import DesktopView from './desktop-view/desktop-view';
import {useTableOfContents} from './common/hooks';
import './details.css';
import './table-of-contents.css';

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

function TOCSlideout({tocState, html}) {
    return (
        <div className="toc-slideout">
            <div className="top-padding">
                <span
                    className="close-toc" role="button" tabindex="0"
                    onClick={() => tocState.toggle()}
                    onKeyDown={$.treatSpaceOrEnterAsClick}
                >
                    &times;
                </span>
            </div>
            <div className="toc-slideout-contents">
                <div className="toc-drawer">
                    <RawHTML html={html} className="table-of-contents" />
                </div>
            </div>
            <div className="bottom-padding"></div>
        </div>
    );
}

function setCardBackground(isShowingCards) {
    const el = document.querySelector('.details-page');

    el.classList[isShowingCards ? 'add' : 'remove']('card-background');
}

export function BookDetails({data}) {
    const modelRef = useRef($.camelCaseKeys(data));
    const model = modelRef.current;
    const {
        reverseGradient,
        title: bookTitle,
        titleImageUrl: titleImage
    } = model;
    const titleLogo = ''; // For future use
    const [tocActive, toggleTocActive] = useToggle(false);
    const tocState = {
        isOpen: tocActive,
        toggle: toggleTocActive
    };
    const cwClass = cn('content-wrapper', {'drawer-open': tocActive});
    const tocHtml = useTableOfContents(model);

    useEffect(() => {
        setPageColor(model.coverColor);
        setJsonLd(model);
        analytics.addResourcesToLookupTable(data);
    }, [data, model]);

    return (
        <React.Fragment>
            <div className={cn('hero', {'reverse-gradient': reverseGradient})}>
                <div className="content book-title">
                    {titleImage && <TitleImage {...{titleImage, bookTitle, titleLogo}} />}
                </div>
            </div>
            <div className={cwClass} data-slug={model.slug}>
                <TOCSlideout tocState={tocState} html={tocHtml} />
                <div className="content">
                    <div className="phone-view">
                        <PhoneView model={model} />
                    </div>
                    <div className="bigger-view">
                        <DesktopView model={model} tocState={tocState} onContentChange={setCardBackground} />
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
}

function getSlugFromLocation() {
    const bookTitle = window.location.pathname.replace(/.*details\//, '');
    let slug;

    if (/^books/.test(bookTitle)) {
        slug = bookTitle;
    } else {
        slug = `books/${bookTitle}`;
    }
    // Special handling for books whose slugs have changed
    if (/university-physics$/.test(slug)) {
        slug += '-volume-1';
    }

    return slug;
}

function BookDetailsLoader() {
    useCanonicalLink();

    return (
        <LoaderPage slug={getSlugFromLocation()} Child={BookDetails} />
    );
}

const view = {
    classes: ['details-page'],
    tag: 'main'
};

export default pageWrapper(BookDetailsLoader, view);
