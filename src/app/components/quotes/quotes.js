import BaseView from '~/helpers/backbone/view';
import Quote from '~/components/quote/quote';
import {props} from '~/helpers/backbone/decorators';
import {template} from './quotes.hbs';

@props({
    template,
    regions: {
        quotes: '.quotes'
    }
})
export default class Quotes extends BaseView {
    constructor(data) {
        super();
        this.data = data;
    }

    onRender() {
        for (let templateHelper of this.data) {
            this.regions.quotes.append(new Quote(templateHelper));
        }
    }
}
