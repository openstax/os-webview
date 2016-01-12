import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './adoption.hbs';

@props({
    template: template
})

export default class Adoption extends BaseView {
    onRender() {
        // this.regions.featured.show(new CarouselView());
    }
}
