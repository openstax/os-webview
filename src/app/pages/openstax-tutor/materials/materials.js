import React from 'react';
import {LabeledSection} from '../common';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './materials.scss';

export default function Materials({model: {availableBooksHeader: headline, tutorBooks: books}}) {
    const headerLabel = 'Materials';

    return (
        <LabeledSection headerLabel={headerLabel} headline={headline}>
            <div className="materials">
                {
                    books?.map((book) =>
                        <div className="book-card" key={book.title}>
                            <img src={book.coverUrl} alt={`${book.title} cover`} />
                            <RawHTML html={book.title} />
                        </div>
                    )
                }
            </div>
        </LabeledSection>
    );
}
