import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import usePageData from '~/helpers/use-page-data';
import {useParams} from 'react-router-dom';
import useDocumentHead from '~/helpers/use-document-head';
import './footer-page.scss';

const specialSlugFromPath: Record<string, string> = {
    '/privacy': '/privacy-policy'
};

type PageData = {
    introHeading: string;
    title: string;
    meta: {
        searchDescription: string;
    };
} & {
    [contentFieldName: string]: string;
}

function FooterPage({data}: {data: PageData}) {
    useDocumentHead({
        title: data.title,
        description: data.meta.searchDescription
    });

    const contentFieldName = Object.keys(data)
        .find((k) => k.match(/Content$/)) as string;
    const {introHeading: heading, [contentFieldName]: content} = data;

    return (
        <div className="footer-page page">
            <img className="strips" src="/dist/images/components/strips.svg" height="10" alt="" role="presentation" />
            <main id="maincontent" className="text-content left-justified">
                <RawHTML Tag="h1" html={heading} />
                <RawHTML html={content} />
            </main>
        </div>
    );
}

export default function LoadFooterPage() {
    const pathname = `/${useParams()['*']}`;
    const slugEnd = specialSlugFromPath[pathname] ?? pathname;
    const slug = `pages${slugEnd}`;
    const data = usePageData<PageData>(slug);

    React.useLayoutEffect(
        () => window.scrollTo(0, 0),
        [pathname]
    );

    if (!data) {
        return null;
    }

    return <FooterPage data={data} />;
}
