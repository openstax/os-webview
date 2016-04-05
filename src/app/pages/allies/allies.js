import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import PageModel from '~/models/pagemodel';
import FilterButton from '~/components/filter-button/filter-button';
import Ally from '~/pages/allies/ally/ally';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './allies.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const categories = ['Math', 'Science', 'Social Sciences', 'History', 'AP®'],
    filterButtons = ['View All', ...categories];

let alliesData = {},
    logoPromises = [],
    alliesDataPromise, pageDataPromise;


function handleAlliesData(data) {
    for (let page of data.pages) {
        let name = page.heading;

        data.pages.sort((a, b) => a.name < b.name ? a : b);

        alliesData[name] = {
            name,
            blurb: page.long_description,
            subjects: page.ally_subject_list,
            bookLinks: [],
            isAp: page.is_ap
        };
        if (page.ally_logo) {
            alliesData[name].logoUrl = page.ally_logo;
        }
    }
}

pageDataPromise = new PageModel().fetch({
    data: {
        type: 'pages.EcosystemAllies',
        fields: ['title', 'classroom_text']
    }
});

alliesDataPromise = new PageModel().fetch({
    data: {
        type: 'allies.Ally',
        fields: ['ally_subject_list', 'title', 'short_description', 'long_description',
                'ally_logo', 'heading', 'is_ap']
    }
}).then(handleAlliesData);

@props({
    template,
    templateHelpers: {strips},
    regions: {
        filterButtons: '.filter-buttons',
        blurbs: '.blurbs .container'
    }
})
export default class Allies extends BaseView {
    @on('click .filter')
    filterClick(e) {
        $.scrollTo(e.target, 60);
    }

    constructor() {
        super();
        this.stateModel = new BaseModel({
            selectedFilter: 'View All',
            selectedBook: null
        });
    }

    handlePageData(data) {
        this.el.querySelector('#page-title').textContent = data.pages[0].title;
        this.el.querySelector('#page-subhead').innerHTML = data.pages[0].classroom_text;
    }

    onRender() {
        this.el.classList.add('allies-page');
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
        pageDataPromise.then(this.handlePageData.bind(this));
    }
}
