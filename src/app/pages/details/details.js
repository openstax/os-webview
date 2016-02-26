import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import Author from './author/author';
import {props} from '~/helpers/backbone/decorators';
import {template} from './details.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';

function dataToTemplateHelper(data) {
    let quotes = data.book_quotes[0],
        result = {
            title: data.title,
            description: data.description,
            endorsement: quotes.quote_text,
            attribution: quotes.quote_author,
            attributionSchool: quotes.quote_author_school,
            topAuthors: data.book_contributing_authors.filter((entry) => entry.display_at_top),
            allAuthors: data.book_contributing_authors
        };

    result.coverUrl = data.cover_url ||
    `https://placeholdit.imgix.net/~text?txtsize=33&txt=${this.model.get('title')}&w=220&h=220`;

    return result;
}

@props({
    model: new BaseModel(),
    template: template,
    regions: {
        getThisTitle: '.floating-menu .get-this-book',
        topAuthors: '#top-authors',
        allAuthors: '#all-authors'
    }
})
export default class Details extends BaseView {
    constructor() {
        super(...arguments);
        this.id = decodeURIComponent(window.location.search.substr(1));
        this.templateHelpers = {};
        this.gtt = new GetThisTitle(this.title, this.model);
    }

    onRender() {
        this.model.fetch({
            'url': `https://oscms-dev.openstax.org/api/v1/pages/${this.id}`
        }).then((data) => {
            let th = dataToTemplateHelper(data);

            for (let topAuthor of th.topAuthors) {
                this.regions.topAuthors.append(new Author(topAuthor));
            }
            for (let author of th.allAuthors) {
                this.regions.allAuthors.append(new Author(author));
            }
            this.el.querySelector('.book-cover').src = th.coverUrl;
            this.el.querySelector('.book-info .title').textContent = th.title;
            this.el.querySelector('.book-info .blurb').innerHTML = th.description;
            document.getElementById('endorsement').innerHTML = th.endorsement;
            document.getElementById('attribution').textContent = th.attribution;
            document.getElementById('attribution-school').textContent = th.attributionSchool;
        });
        this.regions.getThisTitle.show(this.gtt);
    }
}
