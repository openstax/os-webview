import React from 'react';
import './byline.scss';
import {formatDateForBlog} from '~/helpers/data';

export default function Byline({date, author, source}) {
    return (
        <div className="byline">
            {
                source ?
                    <span className="source">{source}</span> :
                    <span className="author">{author}</span>
            }
            <span className="date">{formatDateForBlog(date)}</span>
        </div>
    );
}
