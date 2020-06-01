import React, {useState, useEffect} from 'react';
import ChildComponent from '~/components/a-component-template/a-component-template.jsx';
import './a-page-template.css';
import {fetchPageData} from '~/helpers/controller/cms-mixin';
import $ from '~/helpers/$';

const slug = 'books/biology-2e';

// React.Fragment is a parent node when you don't want to have a parent node.
export default function () {
    const [pageData, setPageData] = useState();

    useEffect(() => {
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    }, []);
    useEffect(() => fetchPageData({slug}).then(setPageData), []);

    if (!pageData) {
        return (
            <div className="content loading" />
        );
    }

    const heading = pageData.title;
    const message = pageData.meta.seo_title;

    document.title = pageData.title;
    return (
        <div className="content">
            <h1>{heading}</h1>
            {
                message &&
                <ChildComponent message={message} />
            }
        </div>
    );
}
