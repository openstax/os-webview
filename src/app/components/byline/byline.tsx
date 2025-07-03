import React from 'react';
import './byline.scss';
import {formatDateForBlog} from '~/helpers/data';

type BylineArgs = {
    date: string;
    author?: string;
    source?: string;
};

export default function Byline({date, source, author}: BylineArgs) {
    return (
        <div className="byline">
            {source ? (
                <span className="source">{source}</span>
            ) : (
                <span className="author">{author}</span>
            )}
            <span className="date">{formatDateForBlog(date)}</span>
        </div>
    );
}
