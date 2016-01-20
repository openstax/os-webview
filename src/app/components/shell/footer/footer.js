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
    console.log('testing');
    // this.regions.featured.show(new CarouselView());
  //   var waypoint = new Waypoint({
  //   element: document.getElementById('main-nav'),
  //   handler: function(direction) {
  //     console.log(this.element.id + ' triggers at ' + this.triggerPoint)
  //   },
  //   offset: 20
  // })
  // var waypoint = new Waypoint({
  //   element: document.getElementById('main'),
  //   handler: function(direction) {
  //     console.log('Scrolled to waypoint!')
  //   }
  // })
  // var sticky = new Waypoint.Sticky({
  //   element: document.getElementsByClassName('nav')[0],
  //   //wrapper: false,
  //   handler: function(direction) {
  //     alert('50% past the top')
  //   },
  //   offset: -150
  // })
  window.addEventListener("scroll", function(e) {
    console.log('test');
    var element = document.getElementById('header');
    console.log(element.scrollTop);

    if (document.body.scrollTop >= 70) {
      element.className = "sticky";
      //console.log(element.scrollTop);

    } else if (document.body.scrollTop <= 70) {
      //wrap.removeClass("fix-search");
      //console.log('bark');
      element.className = "";

}

});
  }
}
