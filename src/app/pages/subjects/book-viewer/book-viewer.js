import React, {useState, useEffect} from 'react';
import {RawHTML, ActiveElementContextProvider, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {BookCover} from './book';
import categoryPromise from '~/models/subjectCategories';

function organizeBooksByCategory(books, categories) {
    const result = {};
    const addLabels = () => {
        for (const category of categories) {
            if (result[category.cms]) {
                result[category.cms].label = category.html;
            }
        }
    };

    for (const book of books) {
        book.subjects.forEach((cmsCategory) => {
            if (!(cmsCategory in result)) {
                result[cmsCategory] = [];
            }
            if (!result[cmsCategory].includes(book)) {
                result[cmsCategory].push(book);
            }
        });
    }

    addLabels();

    return result;
}

function CategorySection({categoryData, categorizedBooks, category}) {
    const classList = ['book-category'];
    const subjectHtml = categoryData.html;
    const books = categorizedBooks[categoryData.cms];

    if (!['view-all', categoryData.value].includes(category)) {
        classList.push('hidden');
    }
    return (
        <div className={classList.join(' ')}>
            <RawHTML Tag="h2" html={subjectHtml} className="subject" />
            <div className="row">
                {
                    books.map((book) =>
                        <BookCover {...book} key={book.slug} />
                    )
                }
            </div>
        </div>
    );
}

export default function BookViewer({books, category}) {
    const categories = useDataFromPromise(categoryPromise, []);
    const categorizedBooks = organizeBooksByCategory(books, categories);

    if (!categorizedBooks) {
        return (<div>Loading...</div>);
    }

    return (
        <div className="container">
            <ActiveElementContextProvider>
                {
                    categories
                        .filter((c) => c.cms)
                        .map((c) =>
                            <CategorySection
                                categoryData={c}
                                categorizedBooks={categorizedBooks}
                                category={category}
                                key={c.cms}
                            />
                        )
                }
            </ActiveElementContextProvider>
        </div>
    );
}
