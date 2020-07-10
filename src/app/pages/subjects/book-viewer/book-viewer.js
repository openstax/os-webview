import React, {useState, useEffect} from 'react';
import CategorySelector from '~/components/category-selector/category-selector';
import {RawHTML, ActiveElementContextProvider} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {BookCover} from './book';

function organizeBooksByCategory(books) {
    const result = {};
    const addLabels = () => {
        for (const category of CategorySelector.categories) {
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
            <div class="row">
                {
                    books.map((book) =>
                        <BookCover {...book} />
                    )
                }
            </div>
        </div>
    );
}

function useCategorySections(books) {
    const [categorizedBooks, setCategorizedBooks] = useState();

    useEffect(() => {
        CategorySelector.loaded.then(() => {
            setCategorizedBooks(organizeBooksByCategory(books));
        });
    }, [books]);

    return categorizedBooks;
}

export default function BookViewer({books, category}) {
    const categorizedBooks = useCategorySections(books);

    if (!categorizedBooks) {
        return (<div>Loading...</div>);
    }

    return (
        <div className="container">
            <ActiveElementContextProvider>
                {
                    CategorySelector.categories
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
