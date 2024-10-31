import React from 'react';
import {useIntl} from 'react-intl';
import groupBy from 'lodash/groupBy';

function Authors({heading, className, authors=[]}) {
    if (authors.length === 0) {
        return null;
    }
    return (
        <div>
            <h3 className="author-heading">{heading}</h3>
            {
                authors.map((author) =>
                    <div className={className} key={author.name}>
                        {author.name}
                        {author.university ? `, ${author.university}` : ''}
                    </div>
                )
            }
        </div>
    );
}

export default function AuthorsSection({model, polish}) {
    const intl = useIntl();
    const headings = polish ? [
        'Główni autorzy', 'Autorzy współpracujący'
    ] : [
        intl.formatMessage({id: 'authors.senior'}),
        intl.formatMessage({id: 'authors.contributing'})
    ];
    const groupFn = (author) => author.seniorAuthor ? 'senior' : 'regular';
    const groupedAuthors = groupBy(model.authors, groupFn);

    return (
        <React.Fragment>
            <Authors
                heading={headings[0]}
                className="loc-senior-author"
                authors={groupedAuthors.senior}
            />
            <Authors
                heading={headings[1]}
                className="loc-nonsenior-author"
                authors={groupedAuthors.regular}
            />
        </React.Fragment>
    );
}
