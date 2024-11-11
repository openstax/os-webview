import React from 'react';
import {useIntl} from 'react-intl';
import groupBy from 'lodash/groupBy';
import useDetailsContext from '../context';
import $ from '~/helpers/$';

function Authors({
    heading,
    className,
    authors = []
}: {
    heading: string;
    className: string;
    authors: ReturnType<typeof useDetailsContext>['authors'];
}) {
    if (authors.length === 0) {
        return null;
    }
    return (
        <div>
            <h3 className="author-heading">{heading}</h3>
            {authors.map((author) => (
                <div className={className} key={author.name}>
                    {author.name}
                    {author.university ? `, ${author.university}` : ''}
                </div>
            ))}
        </div>
    );
}

export default function AuthorsSection() {
    const {authors, title} = useDetailsContext();
    const polish = $.isPolish(title);
    const intl = useIntl();
    const headings = polish
        ? ['Główni autorzy', 'Autorzy współpracujący']
        : [
              intl.formatMessage({id: 'authors.senior'}),
              intl.formatMessage({id: 'authors.contributing'})
          ];
    const groupFn = (author: (typeof authors)[0]) =>
        author.seniorAuthor ? 'senior' : 'regular';
    const groupedAuthors = groupBy(authors, groupFn);

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
