import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './contents.hbs';

@props({
    template,
    regions: {
        subunit: '.subunit'
    }
})
export default class ContentEntry extends BaseView {
    constructor(data) {
        super();
        this.templateHelpers = data;
    }

    onRender() {
        if (this.templateHelpers.contents) {
            for (let entry of this.templateHelpers.contents) {
                this.regions.subunit.appendAs('li', new ContentEntry(entry));
            }
        }
    }
}
