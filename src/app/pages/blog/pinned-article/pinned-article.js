import React from 'react';
import {ArticleSummary} from '../article-summary/article-summary.jsx';
import './pinned-article.css';

export default function PinnedArticle({model}) {
    return (
        <div className="pinned-article boxed">
            <ArticleSummary {...model} />
        </div>
    );
}
