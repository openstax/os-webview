import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import useTOCContext, {TOCContextProvider} from './common/toc-slideout/context';
import TOCSlideout from './common/toc-slideout/toc-slideout';
import $ from '~/helpers/$';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import cn from 'classnames';
import PhoneView from './phone-view/phone-view';
import DesktopView from './desktop-view/desktop-view';
import {FormattedMessage} from 'react-intl';
import LanguageSelector, {useLanguageText} from '~/components/language-selector/language-selector';
import {useTableOfContents} from './common/hooks';
import useLanguageContext from '~/contexts/language';
import useDetailsContext, {DetailsContextProvider} from './context';
import {WindowContextProvider} from '~/contexts/window';
import './details.scss';
import './table-of-contents.scss';

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
            <img className="title-image" src={titleImage} alt={bookTitle} height="130" width="392" />
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

function AnotherLanguage({locale, translations}) {
    const LanguageText = useLanguageText(locale);
    const translation = React.useMemo(
        () => translations.find((t) => t.locale === locale),
        [translations, locale]
    );

    // translation is guaranteed to have a valid value, because the locale
    // is pulled from translations
    return (
        <a href={`/details/books/${translation.slug}`}>
            <LanguageText />
        </a>
    );
}

function LinksToTranslations() {
    // This sets translations
    const {translations: [translations=[]]} = useDetailsContext();
    const LeadIn = React.useCallback(
        () => <FormattedMessage id="bookAvailableIn" defaultMessage="This book available in" />,
        []
    );
    const LinkPresentation = React.useCallback(
        ({locale: loc}) => <AnotherLanguage locale={loc} translations={translations} />,
        [translations]
    );

    if (translations.length === 0) {
        return null;
    }

    return (
        <LanguageSelector
            LeadIn={LeadIn}
            otherLocales={translations.map((t) => t.locale)}
            LinkPresentation={LinkPresentation}
        />
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
    const {setLanguage} = useLanguageContext();

    useEffect(
        () => {
            setPageColor(model.coverColor);
            setJsonLd(model);
            setLanguage(model.meta.locale);
        },
        [model, setLanguage]
    );

    return (
        <main className="details-page">
            <div className={cn('hero', {'reverse-gradient': reverseGradient})}>
                <div className="content book-title">
                    {titleImage && <TitleImage {...{titleImage, bookTitle, titleLogo}} />}
                </div>
            </div>
            <TOCContextProvider>
                <TocSlideoutAndContent>
                    <WindowContextProvider>
                        <div className="phone-view">
                            <LinksToTranslations />
                            <PhoneView />
                        </div>
                        <div className="bigger-view">
                            <LinksToTranslations />
                            <DesktopView onContentChange={setCardBackground} />
                        </div>
                    </WindowContextProvider>
                </TocSlideoutAndContent>
            </TOCContextProvider>
        </main>
    );
}

function getSlugFromLocation(pathname) {
    const bookTitle = pathname.replace(/.*details\//, '');
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

function BookDetailsWithContext({data}) {
    return (
        <DetailsContextProvider contextValueParameters={{data}}>
            <BookDetails />
        </DetailsContextProvider>
    );
}

export default function BookDetailsLoader() {
    const {pathname} = useLocation();
    const slug = getSlugFromLocation(pathname);

    return (
        <LoaderPage slug={slug} Child={BookDetailsWithContext} doDocumentSetup />
    );
}
