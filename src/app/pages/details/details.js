import React, {useEffect} from 'react';
import useTOCContext, {TOCContextProvider} from './common/toc-slideout/context';
import TOCSlideout from './common/toc-slideout/toc-slideout';
import $ from '~/helpers/$';
import analytics from '~/helpers/analytics';
import cn from 'classnames';
import PhoneView from './phone-view/phone-view';
import DesktopView from './desktop-view/desktop-view';
import {languageTranslations} from '~/components/language-selector/language-selector';
import {useTableOfContents} from './common/hooks';
import useDetailsContext, {DetailsContextProvider} from './context';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faGlobe} from '@fortawesome/free-solid-svg-icons/faGlobe';
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
    const {isOpen} = useTOCContext();
    const model = useDetailsContext();
    const cwClass = cn('content-wrapper', {'drawer-open': isOpen});
    const tocHtml = useTableOfContents(model);

    return (
        <div className={cwClass} data-slug={model.slug}>
            <TOCSlideout html={tocHtml} />
            <div className="content">
                {children}
            </div>
        </div>
    );
}

const leadInText = {
    en: 'This textbook is available in',
    es: 'Este libro de texto está disponible en'
};

function AnotherLanguage({locale, translation}) {
    const tr = languageTranslations[locale];

    return (
        <React.Fragment>
            {' '}and{' '}
            <a href={`/details/books/${translation.slug}`}>{tr[translation.locale]}</a>
        </React.Fragment>
    );
}

function LinksToTranslations() {
    const {translations: [translations=[]], meta: {locale}} = useDetailsContext();
    const localLanguage = languageTranslations[locale][locale];

    return (
        <div className="language-selector">
            <FontAwesomeIcon icon={faGlobe} />
            <span>
                {leadInText[locale] || leadInText.en}{' '}
                {localLanguage}
                {
                    translations.map((t) =>
                        <AnotherLanguage
                            key={t.locale}
                            locale={locale}
                            translation={t}
                        />
                    )
                }
            </span>
        </div>
    );
}

export function BookDetails() {
    const model = useDetailsContext();
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
            <TOCContextProvider>
                <TocSlideoutAndContent>
                    <div className="phone-view">
                        <LinksToTranslations />
                        <PhoneView />
                    </div>
                    <div className="bigger-view">
                        <LinksToTranslations />
                        <DesktopView onContentChange={setCardBackground} />
                    </div>
                </TocSlideoutAndContent>
            </TOCContextProvider>
        </React.Fragment>
    );
}

export default function BookDetailsLoader() {
    return (
        <main className="details-page">
            <DetailsContextProvider>
                <BookDetails />
            </DetailsContextProvider>
        </main>
    );
}
