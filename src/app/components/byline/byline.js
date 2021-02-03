import React from 'react';
import {pageWrapper} from '~/controllers/jsx-wrapper';
import './byline.css';
import {formatDateForBlog} from '~/helpers/data';

const view = {
    classes: ['byline']
};

export function Byline({date, author, source}) {
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

export default pageWrapper(Byline, view);
