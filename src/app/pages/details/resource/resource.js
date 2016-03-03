import BaseView from '~/helpers/backbone/view';
import PageModel from '~/models/pagemodel';
import {props} from '~/helpers/backbone/decorators';
import {template} from './resource.hbs';

@props({template})
export default class Resource extends BaseView {
    constructor(data) {
        super();
        this.templateHelpers = data;
        this.modelPromise = new PageModel().fetch({
            url: data.link_document.meta.detail_url
        });
    }

    onRender() {
        this.modelPromise.then((data) => {
            this.el.querySelector('.resource-title').textContent = data.title;
            this.el.querySelector('.resource-link').href = data.meta.download_url;
        });
    }
}
