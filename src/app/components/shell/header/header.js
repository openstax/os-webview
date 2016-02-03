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

    @on('click .active .container > .nav-menu > .parent > a')
    stop(e) {
      //console.log('test')
      let metaNav = this.el.querySelector('.meta-nav');
      e.preventDefault();
      //console.log(e.path[2]);
      console.log("this is target" + e.delegateTarget.parentNode);

      e.delegateTarget.parentNode.classList.add('open');
      e.delegateTarget.parentNode.parentNode.classList.add('open');
      metaNav.classList.add('open');


      let $this = e.delegateTarget;
      let dropdown = e.delegateTarget.nextElementSibling;
      console.log($this);
      console.log(dropdown);

       var clone = $this.cloneNode(true);
       var el = document.createElement('li');
       el.setAttribute('class', 'nav-menu-item clone');
       var span = document.createElement('a');
       span.setAttribute('class', 'back');
       span.text = "Back";
       el.appendChild(span);
       el.appendChild(clone);

       dropdown.insertBefore(el, dropdown.childNodes[0]);



    }
    @on('click .active .nav-menu-item.clone .back')
    stop2(e) {
      console.log('test2');
      let metaNav = this.el.querySelector('.meta-nav');
      let mainNav = document.getElementById('main-nav');
      let parentItem = this.el.querySelector('.parent');
      let cloneNavItem = this.el.querySelector('.nav-menu-item.clone');

      e.preventDefault();
      //console.log(cloneNavItem);
      //console.log("this is target" + e.target[3]);
      //console.log(e.path[1]);
      //console.log(e.path[0]);
      console.log(e.delegateTarget.parentNode.parentNode.parentNode);

      // toggleClass(metaNav, 'open');
      // toggleClass(mainNav, 'open');
      // toggleClass(parentItem, 'open');
      metaNav.classList.remove('open');
      mainNav.classList.remove('open');
      e.delegateTarget.parentNode.parentNode.parentNode.classList.remove('open');

      cloneNavItem.parentNode.removeChild(cloneNavItem);


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
