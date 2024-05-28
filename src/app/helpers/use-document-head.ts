import {useEffect} from 'react';
import {htmlToText} from '~/helpers/data';
import {setContentTags} from '~/helpers/tag-manager';
import {camelCaseKeys} from '~/helpers/page-data-utils';
import announcePageTitle from '~/components/shell/header/announce-page-title';
import {useLocation} from 'react-router-dom';

function setCanonicalPath(newPath: string) {
    const el = document.createElement('link');
    const titleEl = document.querySelector('head title');

    if (titleEl) {
        el.setAttribute('rel', 'canonical');
        titleEl.parentNode?.insertBefore(el, titleEl.nextSibling);
    }
    const host = 'https://openstax.org';

    el.href = `${host}${newPath}`;
    return el;
}

function noindexMeta() {
    const el = document.createElement('meta');
    const titleEl = document.querySelector('head title');

    if (titleEl) {
        el.setAttribute('name', 'robots');
        el.setAttribute('content', 'noindex');
        titleEl.parentNode?.insertBefore(el, titleEl.nextSibling);
    }

    return el;
}

export function useCanonicalLink(controlsHeader = true, path?: string) {
    const defaultPath = useLocation().pathname;
    const newPath = (path || defaultPath).replace(/\/$/, '');

    useEffect(() => {
        if (!controlsHeader) {
            return () => null;
        }
        const linkController = setCanonicalPath(newPath);

        return () => linkController.remove();
    }, [controlsHeader, newPath]);
}

export function useNoIndex(controlsHeader: boolean) {
    useEffect(() => {
        if (controlsHeader) {
            const el = noindexMeta();

            return () => el.remove();
        }
        return () => null;
    }, [controlsHeader]);
}

function getPageDescriptionElement() {
    return document.querySelector('head meta[name="description"]');
}

export function getPageDescription() {
    return getPageDescriptionElement()?.getAttribute('content');
}

export function setPageDescription(description?: string) {
    const defaultDescription =
        'Access our free college textbooks and low-cost learning materials.';
    const descriptionEl = getPageDescriptionElement();

    if (descriptionEl) {
        descriptionEl.setAttribute(
            'content',
            description || defaultDescription
        );
    } else {
        console.warn('No description meta entry in page header');
    }
}

function setPageTitleAndDescription(title = 'OpenStax', description?: string) {
    setPageDescription(description);
    document.title = title.includes('OpenStax') ? title : `${title} - OpenStax`;
    document.getElementById('main')?.focus();
    announcePageTitle(document.title);
}

type Subject = {
    subjectName: string;
};

type Category = {
    subjectCategory: string;
    subjectName: string;
};

type ArticleSubject = {name: string} | {value: {subject: {name: string}}[]};

type Collection = {name: string} | {value: {collection: {name: string}}[]};

type BookData = {
    meta?: object;
    description?: string;
    bookSubjects?: Subject[];
    bookCategories?: Category[];
    title?: string;
    articleSubjects?: ArticleSubject[];
    collections?: Collection[];
};

// eslint-disable-next-line complexity
export function setPageTitleAndDescriptionFromBookData(data: BookData = {}) {
    const meta = camelCaseKeys(data.meta || {});
    const defaultDescription = data.description
        ? htmlToText(data.description)
        : '';

    // setPageTitleAndDescriptionFromBookData is actually called with a variety
    // of page data types, not just books
    const contentTags =
        // eslint-disable-next-line no-nested-ternary
        /* books */ data.bookSubjects && data.bookCategories
            ? [
                  `book=${data.title}`,
                  ...data.bookSubjects.map(
                      (subject) => `subject=${subject.subjectName}`
                  ),
                  ...data.bookCategories.map(
                      (category) =>
                          `category=${category.subjectCategory} (${category.subjectName})`
                  )
              ]
            : /* blog posts */ data.articleSubjects && data.collections
            ? [
                  ...data.collections
                      .map((item) =>
                          'name' in item
                              ? item.name
                              : item.value.map(
                                    ({collection}) => collection.name
                                )
                      )
                      .flat(2)
                      .map((name) => `collection=${name}`),
                  ...data.articleSubjects
                      .map((item) =>
                          'name' in item
                              ? item.name
                              : item.value.map(({subject}) => subject.name)
                      )
                      .flat(2)
                      .map((name) => `subject=${name}`)
              ]
            : [];

    setContentTags(contentTags);

    setPageTitleAndDescription(
        meta.seoTitle || data.title,
        meta.searchDescription || defaultDescription
    );
}

export default function useDocumentHead({
    title,
    description = undefined,
    noindex = false
}: {
    title?: string;
    description?: string;
    noindex?: boolean;
}) {
    useEffect(() => {
        setPageTitleAndDescription(title, description);
    }, [title, description]);

    useEffect(() => {
        if (noindex) {
            const tag = document.createElement('meta');

            tag.setAttribute('content', 'noindex');
            tag.setAttribute('name', 'robots');
            document.head.appendChild(tag);

            return () => {
                document.head.removeChild(tag);
            };
        }
        return () => null;
    }, [noindex]);
}
