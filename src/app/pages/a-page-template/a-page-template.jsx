import React, {useState, useEffect} from 'react';
import ChildComponent from '~/components/a-component-template/a-component-template.jsx';
import './a-page-template.css';
import {handleOnce} from '~/models/cmsFetch';
import $ from '~/helpers/$';

const slug = 'books/biology-2e';
const handlePageData = handleOnce(slug);

// React.Fragment is a parent node when you don't want to have a parent node.
export default function () {
    const [heading, updateHeading] = useState('This is a page');
    const [message, updateMessage] = useState();

    handlePageData((data) => {
        console.info('Fetched', data);
        updateHeading(data.title);
        updateMessage(data.meta.seo_title);
        document.title = data.title;
    });

    useEffect(() => {
        const linkController = $.setCanonicalLink();

        return () => linkController.remove();
    });

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
