import React from 'react';
import {ArticleSummary} from '../article-summary/article-summary.jsx';
import './pinned-article.scss';

export default function PinnedArticle({model}) {
    return (
        <div className="pinned-article boxed">
            <ArticleSummary {...model} />
        </div>
    );
}
