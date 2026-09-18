import React from 'react';
import './byline.scss';
import {formatDateForBlog} from '~/helpers/data';

type BylineArgs = {
    date: string;
    author?: string;
};

export default function Byline({date, author}: BylineArgs) {
    return (
        <div className="byline">
            <span className="author">{author}</span>
            <span className="date">{formatDateForBlog(date)}</span>
        </div>
    );
}
