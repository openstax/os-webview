import useSubjectsContext from './context';
import useSubjectCategoryContext from '~/contexts/subject-category';

type Book = {
    subjects: string[];
};

type CategoryWithBooks = Book[] & {
    label?: string;
};

type CategorizedBooks = Record<string, CategoryWithBooks>;

export default function useCategorizedBooks(): CategorizedBooks {
    const {books} = useSubjectsContext();
    const categories = useSubjectCategoryContext();
    const result: CategorizedBooks = {};
    const addLabels = () => {
        for (const category of categories) {
            if (result[category.cms]) {
                result[category.cms].label = category.html;
            }
        }
    };

    for (const book of books) {
        book.subjects.forEach((cmsCategory: string) => {
            if (!(cmsCategory in result)) {
                result[cmsCategory] = [] as CategoryWithBooks;
            }
            if (!result[cmsCategory].includes(book)) {
                result[cmsCategory].push(book);
            }
        });
    }

    addLabels();

    return result;
}
