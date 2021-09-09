import React from 'react';
import useDetailsContext from '~/pages/details/context';
import groupBy from 'lodash/groupBy';

function Authors({heading, className, authors=[], CustomTag='div'}) {
    if (authors.length === 0) {
        return null;
    }
    return (
        <div>
            <CustomTag className="author-heading" role="heading">{heading}</CustomTag>
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

const localizedHeadings = {
    'en': ['Senior Contributing Authors', 'Contributing Authors'],
    'es': ['Autores principales', 'Autores colaboradores']
};

export default function AuthorsSection({model, polish}) {
    const {language} = useDetailsContext();
    const headings = polish ? [
        'Główni autorzy', 'Autorzy współpracujący'
    ] : localizedHeadings[language];
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
