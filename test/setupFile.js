import 'settings';
import './helpers/fetch-mocker';
import './helpers/mock-lazyload';
import {LocalStorage} from 'node-localstorage';
import ReactModal from 'react-modal';

/* eslint-disable */
global.routerFuture = {
  v7_startTransition: true,
  v7_relativeSplatPath: true
};

ReactModal.setAppElement(window.document.createElement('div'));

global.localStorage = new LocalStorage('./local-storage-scratch');
global.pi = jest.fn();
global.document.createRange = () => ({
  setStart: () => {},
  setEnd: () => {},
  selectNodeContents: () => {},
  commonAncestorContainer: {
    nodeName: 'BODY',
    ownerDocument: document,
  },
});
global.document.getSelection = () => {};

window.HTMLElement.prototype.scrollIntoView = jest.fn();

(function() {
    var lastTime = 0;
    var vendors = ['ms', 'moz', 'webkit', 'o'];
    for(var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x]+'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x]+'CancelAnimationFrame']
                                   || window[vendors[x]+'CancelRequestAnimationFrame'];
    }

    if (!window.requestAnimationFrame)
        window.requestAnimationFrame = function(callback, element) {
            var currTime = Date.now();
            var timeToCall = Math.max(0, 16 - (currTime - lastTime));
            var id = window.setTimeout(function() { callback(currTime + timeToCall); },
              timeToCall);
            lastTime = currTime + timeToCall;
            return id;
        };

    if (!window.cancelAnimationFrame)
        window.cancelAnimationFrame = function(id) {
            clearTimeout(id);
        };
}());
