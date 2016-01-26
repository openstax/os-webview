import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import appView from '~/components/shell/shell';
import {template} from './home.hbs';

@props({
    template: template,
    regions: {
        carousel: '.carousel'
    }
})
export default class Home extends BaseView {

    onRender() {
        this.updateHeaderStyle();
        window.addEventListener('scroll', this.updateHeaderStyle.bind(this));
    }

    updateHeaderStyle() {
        if (!appView.header) {
            return;
        }

        let secondaryNavHeight = appView.header.secondaryNavHeight;

        if (window.pageYOffset > secondaryNavHeight && !appView.header.isPinned()) {
            let height = appView.header.height;

            appView.header.reset().collapse().pin();
            this.el.style.paddingTop = `${height / 10}rem`;
        } else if (window.pageYOffset <= secondaryNavHeight && !appView.header.isTransparent()) {
            appView.header.reset().transparent();
            this.el.style.paddingTop = '0';
        }
    }

    onBeforeClose() {
        window.removeEventListner('scroll', this.updateHeaderStyle.bind(this));
    }

}
