import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './home.hbs';

@props({
    template: template,
    regions: {
        carousel: '.carousel'
    }
})
export default class Home extends BaseView {

    onRender() {
        // this.regions.featured.show(new CarouselView());
    }

}
