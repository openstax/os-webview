import BaseView from '~/helpers/backbone/view';
import {on, props} from '~/helpers/backbone/decorators';
import {template} from './header.hbs';

function toggleClass(el, name) {
    if (el.classList.contains(name)) {
        el.classList.remove(name);
    } else {
        el.classList.add(name);
    }
}

@props({
    el: '#header',
    template: template
})


export default class Header extends BaseView {



    @on('click nav > a')
    blurLogo(e) {
        e.delegateTarget.blur();
    }

    @on('click .expand-nav')
    toggleNavMenu(e) {
        let button = this.el.querySelector('.expand-nav');
        let header = this.el.querySelector('.page-header');
        let body = document.body;

        toggleClass(button, 'active');
        toggleClass(header, 'active');
        toggleClass(body, 'active');

    }

    @on('click .skiptocontent a')
    skipToContent() {
        let el = document.getElementById('maincontent');

        function removeTabIndex() {
            this.removeAttribute('tabindex');
            this.removeEventListener('blur', removeTabIndex, false);
            this.removeEventListener('focusout', removeTabIndex, false);
        }

        if (el) {
            if (!(/^(?:a|select|input|button|textarea)$/i).test(el.tagName)) {
                el.tabIndex = -1;
                el.addEventListener('blur', removeTabIndex, false);
                el.addEventListener('focusout', removeTabIndex, false);
            }

            el.focus();
        }
    }

  }
