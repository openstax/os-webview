import booksPromise from './books';
import settings from 'settings';

const categoriesPromise = fetch(`${settings.apiOrigin}/apps/cms/api/snippets/subjects?format=json`)
    .then((r) => r.json());

export default Promise.all([booksPromise, categoriesPromise]).then(([books, categories]) => {
    const usedCategories = {};
    const result = [
        {value: 'view-all', cms: '', html: 'View All'}
    ];

    result.byValue = {};
    books.forEach((b) => b.subjects.forEach((s) => {
        usedCategories[s] = true;
    }));

    categories.filter((c) => usedCategories[c.name])
        .forEach((c) => {
            const name = c.name;
            const value = name.toLowerCase().replace(' ', '-');

            result.push({
                value,
                cms: name,
                html: name,
                title: c.seo_title
            });
        });
    result.push({value: 'ap', cms: 'AP', html: 'AP<sup>&reg;</sup>'});
    result.forEach((obj) => {
        result.byValue[obj.value] = obj;
    });

    return result;
});
