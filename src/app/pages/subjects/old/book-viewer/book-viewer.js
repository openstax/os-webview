import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {ActiveElementContextProvider} from '~/contexts/active-element';
import useSubjectsContext from '../context';
import BookCover from './book';
import useSubjectCategoryContext from '~/contexts/subject-category';
import cn from 'classnames';

function useCategorizedBooks() {
    const {books} = useSubjectsContext();
    const categories = useSubjectCategoryContext();

    return React.useMemo(
        () => {
            const result = {};

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

            for (const category of categories) {
                if (category.cms in result && typeof result[category.cms] === 'object') {
                    result[category.cms].label = category.html;
                }
            }

            return result;
        },
        [books, categories]
    );
}

function CategorySection({categoryData, categorizedBooks, category}) {
    const hidden = !['view-all', categoryData.value].includes(category);
    const subjectHtml = categoryData.html;
    const books = categorizedBooks[categoryData.cms] || [];

    return (
        <div className={cn('book-category', {hidden})}>
            <RawHTML Tag="h2" html={subjectHtml} className="subject" />
            <div className="row">
                {books.map((book) => <BookCover {...book} key={book.slug} />)}
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
