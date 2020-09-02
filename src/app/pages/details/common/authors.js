import React from 'react';

function Authors({heading, className, authors, CustomTag='div'}) {
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

export default function AuthorsSection({model, polish}) {
    const headings = polish ? [
        'Główni autorzy', 'Autorzy współpracujący'
    ] : [
        'Senior Contributing Authors', 'Contributing Authors'
    ];
    const senior = (author) => author.seniorAuthor;
    const nonsenior = (author) => !author.seniorAuthor;
    const allSenior = model.authors.filter(senior);
    const allNonsenior = model.authors.filter(nonsenior);

    return (
        <React.Fragment>
            <Authors
                heading={headings[0]}
                className="loc-senior-author"
                authors={allSenior}
            />
            <Authors
                heading={headings[1]}
                className="loc-nonsenior-author"
                authors={allNonsenior}
            />
        </React.Fragment>
    );
}
