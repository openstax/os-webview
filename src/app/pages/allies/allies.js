import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import PageModel from '~/models/pagemodel';
import FilterButton from '~/components/filter-button/filter-button';
import Icon from './icon/icon';
import Ally from './ally/ally';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './allies.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const categories = ['Math', 'Science', 'Social Sciences', 'History', 'AP®'],
    filterButtons = ['View All', ...categories];

let alliesData = {},
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
            isAp: page.is_ap,
            logoUrl: page.ally_bw_logo
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
                'heading', 'is_ap', 'ally_bw_logo']
    }
}).then(handleAlliesData);

@props({
    template,
    templateHelpers: {strips},
    regions: {
        filterButtons: '.filter-buttons',
        icons: '.icons .container',
        blurbs: '.blurbs.container'
    }
})
export default class Allies extends BaseView {
    @on('click .filter')
    filterClick() {
        let filterSection = this.el.querySelector('.filter');

        $.scrollTo(filterSection, 60);
    }

    updateSelectedFilterFromPath() {
        let pathMatch = window.location.pathname.match(/\/allies\/(.+)/),
            selectedFilter = 'View All';

        if (pathMatch) {
            let subject = FilterButton.canonicalSubject(pathMatch[1]);

            for (let c of categories) {
                if (FilterButton.canonicalSubject(c) === subject) {
                    selectedFilter = c;
                }
            }
        }
        this.stateModel.set('selectedFilter', selectedFilter);
    }

    constructor() {
        super();
        this.stateModel = new BaseModel({
            selectedFilter: 'View All',
            selectedBook: null
        });
        this.updateSelectedFilterFromPath();
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
            for (let name of Object.keys(alliesData).sort()) {
                this.regions.icons.append(new Icon(alliesData[name], this.stateModel));
                this.regions.blurbs.append(new Ally(alliesData[name], this.stateModel));
            }
        });
        pageDataPromise.then(this.handlePageData.bind(this));
    }
}
