import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './footer.hbs';
//require('~/sticky');

@props({
    el: '#footer',
    template: template
})
export default class Footer extends BaseView {
  onRender() {

    var scrollTop = (window.pageYOffset !== undefined) ? window.pageYOffset : (document.documentElement || document.body.parentNode || document.body).scrollTop,
    position = document.body.scrollTop;


    function cloneElement() {
      var element = document.getElementsByClassName('nav-menu')[0];
      var header = document.getElementsByClassName('nav-menu')[1].parentNode;
      console.log(header);
      var clone = element.cloneNode(true);
      clone.classList.add('clone');
      header.insertBefore(clone, header.childNodes[2]);

    }

    function scrollD() {
    var timer;
    var scroll = document.documentElement.scrollTop || document.body.scrollTop;
    var element = document.getElementsByClassName('page-header')[0];



    if (scroll >= 250) {
            element.classList.add('sticky');
            setTimeout(function() {
              element.classList.add('is-visible');
            });
          } else if ((scroll <= 249) && (scroll >= 150)) {

            element.classList.remove('is-visible');
          } else {
            element.classList.remove('sticky');

          }
    }
    window.addEventListener("scroll", function(e) {

      scrollD();

    });
    document.addEventListener("DOMContentLoaded", cloneElement());


  }
}
