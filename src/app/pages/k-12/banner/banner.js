import BaseView from '~/helpers/backbone/view';
import $ from '~/helpers/$';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './banner.hbs';

@props({
    template: template
})
export default class Banner extends BaseView {
    @on('click a[href^="#"]')
    hashClick(e) {
        let target = e.target;

        while (!target.href) {
            target = target.parentNode;
        }
        let hash = new URL(target.href).hash,
            targetEl = document.getElementById(hash.substr(1));

        $.scrollTo(targetEl, 100);
        e.preventDefault();
    }
}
