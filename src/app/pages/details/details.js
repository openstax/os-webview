import React, {useEffect} from 'react';
import {useLocation} from 'react-router-dom';
import useTOCContext, {TOCContextProvider} from './common/toc-slideout/context';
import TOCSlideout from './common/toc-slideout/toc-slideout';
import $ from '~/helpers/$';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import cn from 'classnames';
import TitleImage from './title-image';
import DualView from './dual-view';
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

export function BookDetails() {
    const model = useDetailsContext();
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
            <TitleImage />
            <TOCContextProvider>
                <TocSlideoutAndContent>
                    <WindowContextProvider>
                        <DualView />
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
