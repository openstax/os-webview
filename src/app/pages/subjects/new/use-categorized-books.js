import useSubjectsContext from './context';
import useSubjectCategoryContext from '~/contexts/subject-category';

export default function useCategorizedBooks() {
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
