import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import usePageData from '~/helpers/use-page-data';
import {useLocation} from 'react-router-dom';
import './footer-page.scss';

const specialSlugFromPath = {
    '/privacy': '/privacy-policy'
};

export default function FooterPage() {
    const {pathname} = useLocation();
    const slugEnd = specialSlugFromPath[pathname] || pathname;
    const slug = `pages${slugEnd}`;
    const data = usePageData(slug);

    React.useLayoutEffect(
        () => window.scrollTo(0, 0),
        [pathname]
    );

    if (!data) {
        return null;
    }

    const contentFieldName = Reflect.ownKeys(data)
        .find((k) => k.match(/Content$/));
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
