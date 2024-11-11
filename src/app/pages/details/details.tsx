import React, {useEffect} from 'react';
import {useParams} from 'react-router-dom';
import useTOCContext, {TOCContextProvider} from './common/toc-slideout/context';
import TOCSlideout from './common/toc-slideout/toc-slideout';
import $ from '~/helpers/$';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import cn from 'classnames';
import TitleImage from './title-image';
import DualView from './dual-view';
import {useTableOfContents} from './common/hooks';
import useLanguageContext from '~/contexts/language';
import useDetailsContext, {
    DetailsContextProvider,
    ContextValues
} from './context';
import {WindowContextProvider} from '~/contexts/window';
import './details.scss';
import './table-of-contents.scss';

function setPageColor(color: string) {
    document.querySelector('.details-page')?.classList.add(color);
}

function setJsonLd(data: ContextValues) {
    const el = document.createElement('script');
    const authorData = data.authors.map((obj) => ({
        '@type': 'Person',
        name: obj.name,
        affiliation: obj.university
    }));
    const polish = $.isPolish(data.title);
    const ldData = {
        '@content': 'https://schema.org',
        '@type': 'WebPage',
        datePublished: data.created,
        dateModified: data.updated,
        mainEntity: {
            type: 'Book',
            name: data.title,
            author: authorData,
            publisher: {
                type: 'Organization',
                name: 'OpenStax'
            },
            image: data.coverUrl,
            inLanguage: polish ? 'Polish' : 'English',
            isbn: data.digitalIsbn13,
            url: data.webviewRexLink
        }
    };
    const descriptionEl = document.querySelector(
        'head meta[name="description"]'
    );

    if (descriptionEl) {
        el.type = 'application/ld+json';
        el.textContent = JSON.stringify(ldData, null, 2);
        descriptionEl.parentNode?.insertBefore(el, descriptionEl.nextSibling);
    }
}

function TocSlideoutAndContent({children}: {children: React.ReactNode}) {
    const {isOpen} = useTOCContext();
    const {slug} = useDetailsContext();
    const cwClass = cn('content-wrapper', {'drawer-open': isOpen});
    const tocHtml = useTableOfContents();

    return (
        <div className={cwClass} data-slug={slug}>
            <TOCSlideout html={tocHtml} />
            <div className="content">{children}</div>
        </div>
    );
}

export function BookDetails() {
    const model = useDetailsContext();
    const {setLanguage} = useLanguageContext();

    useEffect(() => {
        setPageColor(model.coverColor);
        setJsonLd(model);
        setLanguage(model.meta.locale);
    }, [model, setLanguage]);

    return (
        <main
            className={cn('details-page', {
                'card-background': model.useCardBackground
            })}
        >
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

function BookDetailsWithContext({data}: {data: ContextValues}) {
    return (
        <DetailsContextProvider contextValueParameters={{data}}>
            <BookDetails />
        </DetailsContextProvider>
    );
}

export default function BookDetailsLoader() {
    const {title} = useParams();
    const slug = `books/${title}`;

    return (
        <LoaderPage
            slug={slug}
            Child={BookDetailsWithContext}
            doDocumentSetup
        />
    );
}
