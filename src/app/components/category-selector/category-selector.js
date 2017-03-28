import {Controller} from 'superb';
import {on} from '~/helpers/controller/decorators';
import RadioPanel from '~/components/radio-panel/radio-panel';

const categories = [
    {value: 'view-all', cms: '', html: 'View All'},
    {value: 'math', cms: 'Math', html: 'Math'},
    {value: 'science', cms: 'Science', html: 'Science'},
    {value: 'social-sciences', cms: 'Social Sciences', html: 'Social Sciences'},
    {value: 'humanities', cms: 'Humanities', html: 'Humanities'},
    {value: 'ap', cms: 'AP', html: 'AP<sup>&reg;</sup>'}
];

const byValue = {};

for (const c of categories) {
    byValue[c.value] = c;
}

export default class CategorySelector extends RadioPanel {

    static categories = categories;
    static byValue = byValue;

    init(setState) {
        super.init(categories, setState);
    }

}
