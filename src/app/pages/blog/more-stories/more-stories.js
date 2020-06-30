import React, {useState} from 'react';
// import WrappedJsx from '~/controllers/jsx-wrapper';
import {Bus} from '~/helpers/controller/bus-mixin';
import SearchBar from '../search-bar/search-bar';
import DelayedImagesSummary from '../article-summary/article-summary.jsx';
import './more-stories.css';

export default function MoreStories({articles, setPath}) {
    return (
        <div className="more-stories">
            <SearchBar setPath={setPath} />
            <div className="cards boxed">
                {
                    articles.map((article) =>
                        <div className="card">
                            <DelayedImagesSummary {...{...article, setPath}} />
                        </div>
                    )
                }
            </div>
        </div>
    );
}
