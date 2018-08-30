import RadioPanel from '~/components/radio-panel/radio-panel';
import settings from 'settings';
import {Controller} from 'superb.js';
import {on} from '~/helpers/controller/decorators';

const categories = [
    {value: 'view-all', cms: '', html: 'View All'}
];
const byValue = {};

const categoriesLoaded = fetch(`${settings.apiOrigin}/api/snippets/subjects?format=json`)
    .then((r) => r.json())
    .then((subjects) => {
        subjects.forEach((subject) => {
            const name = subject.name;

            categories.push({
                value: name.toLowerCase().replace(' ', '-'),
                cms: name,
                html: name
            });
        });
        categories.push({value: 'ap', cms: 'AP', html: 'AP<sup>&reg;</sup>'});
        for (const c of categories) {
            byValue[c.value] = c;
        }
        return categories;
    });

export default class CategorySelector extends RadioPanel {

    static categories = categories;
    static byValue = byValue;

    init(setState) {
        super.init(categories, setState);
    }

    onLoaded() {
        categoriesLoaded.then(() => this.update());
    }

}
