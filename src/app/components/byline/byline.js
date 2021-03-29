import React from 'react';
import './byline.css';
import {formatDateForBlog} from '~/helpers/data';

const view = {
    classes: ['byline']
};

export default function Byline({date, author, source}) {
    return (
        <div className="byline">
            {
                Boolean(source) ?
                    <span className="source">{source}</span> :
                    <span className="author">{author}</span>
            }
            <span className="date">{formatDateForBlog(date)}</span>
        </div>
    );
}
