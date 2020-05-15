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
                    <div className={className}>
                        {author.name}
                        {author.university ? `, ${author.university}` : ''}
                    </div>
                )
            }
        </div>
    );
}

export default function ({model, polish}) {
    const headings = polish ? [
        'Główni autorzy', 'Autorzy współpracujący'
    ] : [
        'Senior Contributing Authors', 'Contributing Authors'
    ];

    return (
        <React.Fragment>
            <Authors heading={headings[0]}
                className="loc-senior-author"
                authors={model.allSenior}
            />
            <Authors heading={headings[1]}
                className="loc-nonsenior-author"
                authors={model.allNonsenior}
            />
        </React.Fragment>
    );
}
