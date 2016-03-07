import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import PageModel from '~/models/pagemodel';
import FilterButton from '~/components/filter-button/filter-button';
import Ally from '~/pages/allies/ally/ally';
import {props} from '~/helpers/backbone/decorators';
import {template} from './allies.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const categories = ['Math', 'Science', 'Social Sciences', 'History', 'AP®'],
    filterButtons = ['View All', ...categories];

let alliesData = {},
    logoPromises = [],
    alliesDataPromise;

alliesDataPromise = new PageModel().fetch({
    data: {
        type: 'books.Book',
        fields: ['subject_name', 'book_allies']
    }
}).then((data) => {
    let imageModel = new BaseModel();

    for (let page of data.pages) {
        for (let ally of page.book_allies) {
            let name = ally.ally_heading;

            /* The link is a book link; go to the top-level */
            let siteLink = ally.book_link_url.replace(/(\.[^/]+)\/.*$/, '$1');

            if (!(name in alliesData)) {
                alliesData[name] = {
                    name: ally.ally_heading,
                    blurb: ally.ally_short_description,
                    linkUrl: siteLink,
                    linkText: ally.book_link_text,
                    subjects: []
                };
                if (ally.ally_logo) {
                    logoPromises.push(
                        imageModel.fetch({url: ally.ally_logo}).then((logoData) => {
                            alliesData[name].logoUrl = logoData.file;
                        })
                    );
                }
            }
            alliesData[name].subjects.push(page.subject_name);
        }
    }
});

@props({
    template,
    templateHelpers: {strips},
    regions: {
        filterButtons: '.filter-buttons',
        blurbs: '.blurbs'
    }
})
export default class Subjects extends BaseView {
    constructor() {
        super();
        this.stateModel = new BaseModel({
            selectedFilter: 'View All',
            selectedBook: null
        });
        this.allyPromise = new PageModel({id: 6}).fetch();
        this.imageModel = new BaseModel();
    }

    onRender() {
        this.el.classList.add('allies-page', 'text-content');
        for (let button of filterButtons) {
            this.regions.filterButtons.append(new FilterButton(button, this.stateModel));
        }
        alliesDataPromise.then(() => {
            Promise.all(logoPromises).then(() => {
                for (let name of Object.keys(alliesData).sort()) {
                    this.regions.blurbs.append(new Ally(alliesData[name], this.stateModel));
                }
            });
        });
    }
}
