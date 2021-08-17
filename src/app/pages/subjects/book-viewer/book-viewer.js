import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {ActiveElementContextProvider} from '~/contexts/active-element';
import useSubjectsContext from '../context';
import BookCover from './book';
import useSubjectCategoryContext from '~/contexts/subject-category';

function useCategorizedBooks() {
    const {books} = useSubjectsContext();
    const categories = useSubjectCategoryContext();
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
    const books = categorizedBooks[categoryData.cms] || [];

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

export default function BookViewer({category}) {
    const categorizedBooks = useCategorizedBooks();
    const categories = useSubjectCategoryContext();

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
