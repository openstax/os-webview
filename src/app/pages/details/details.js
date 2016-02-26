import BaseView from '~/helpers/backbone/view';
import BaseModel from '~/helpers/backbone/model';
import {props} from '~/helpers/backbone/decorators';
import {template} from './details.hbs';
import GetThisTitle from '~/components/get-this-title/get-this-title';

@props({
    model: new BaseModel(),
    template: template,
    templateHelpers: function () {
        return this.model.attributes;
    },
    regions: {
        getThisTitle: '.get-this-book'
    }
})
export default class Details extends BaseView {
    constructor() {
        super(...arguments);
        this.id = decodeURIComponent(window.location.search.substr(1));
        this.model.fetch({
            'url': `https://oscms-dev.openstax.org/api/v1/pages/${this.id}`
        });
        this.model.on('sync', () => {
            if (!this.model.has('cover')) {
                this.model.set('cover', `https://placeholdit.imgix.net/~text?txtsize=33&txt=${this.model.get('title')}&w=220&h=220`);
            }
            this.render();
        });
    }

    onRender() {
        // For some reason this is getting stuck in the shadow dom
        if (typeof this.regions.getThisTitle !== 'string') {
            this.regions.getThisTitle.append(new GetThisTitle(this.title, this.model));
        }
    }
}
