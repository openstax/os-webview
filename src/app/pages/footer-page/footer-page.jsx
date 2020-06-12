import React, {useState, useEffect} from 'react';
import ChildComponent from '~/components/a-component-template/a-component-template.jsx';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './footer-page.css';
import {fetchOnce} from '~/models/cmsFetch';
import $ from '~/helpers/$';

export default function FooterPage() {
    const slug = `pages${window.location.pathname}`;
    const [heading, updateHeading] = useState();
    const [content, updateContent] = useState();

    if (!heading) {
        fetchOnce(slug).then((data) => {
            const contentFieldName = Reflect.ownKeys(data).find((k) => k.match(/_content$/));

            document.title = data.title;
            updateHeading(data.intro_heading);
            updateContent(data[contentFieldName]);
        });
    }

    useEffect(() => {
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    });

    return (
        <React.Fragment>
            <img className="strips" src="/images/components/strips.svg" height="10" alt="" role="presentation" />
            <main id="maincontent" className="text-content left-justified">
                <RawHTML Tag="h1" html={heading} />
                <RawHTML html={content} />
            </main>
        </React.Fragment>
    );
}
