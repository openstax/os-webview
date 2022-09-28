import {useEffect} from 'react';
import {htmlToText} from '~/helpers/data';

function setCanonicalPath(newPath) {
    const el = document.createElement('link');
    const titleEl = document.querySelector('head title');

    if (titleEl) {
        el.setAttribute('rel', 'canonical');
        titleEl.parentNode.insertBefore(el, titleEl.nextSibling);
    }
    const host = 'https://openstax.org';

    el.href = `${host}${newPath}`;
    return el;
}

export function useCanonicalLink(controlsHeader=true, path=window.location.pathname) {
    useEffect(() => {
        if (!controlsHeader) {
            return null;
        }
        const linkController = setCanonicalPath(path);

        return () => linkController.remove();
    }, [controlsHeader, path]);
}

export function setPageDescription(description) {
    const descriptionEl = document.querySelector('head meta[name="description"]');
    const defaultDescription = 'Access our free college textbooks and low-cost learning materials.';

    if (descriptionEl) {
        descriptionEl.setAttribute('content', description || defaultDescription);
    } else {
        console.warn('No description meta entry in page header');
    }
}

function setPageTitleAndDescription(title='OpenStax', description) {
    setPageDescription(description);
    document.title = title.includes('OpenStax') ? title : `${title} - OpenStax`;
}

export function setPageTitleAndDescriptionFromBookData(data) {
    const meta = data.meta || {};
    const defaultDescription = data.description ?
        htmlToText(data.description) : '';

    setPageTitleAndDescription(
        data.title || meta.seo_title,
        meta.search_description || defaultDescription
    );
}

export default function useDocumentHead({title, description, noindex}) {
    useEffect(
        () => setPageTitleAndDescription(title, description),
        [title, description]
    );

    useEffect(
        () => {
            if (noindex) {
                const tag = document.createElement('meta');

                tag.setAttribute('content', 'noindex');
                tag.setAttribute('name', 'robots');
                document.head.appendChild(tag);

                return () => document.head.removeChild(tag);
            }
            return null;
        },
        [noindex]
    );
}
