import 'babel-polyfill';
import 'isomorphic-fetch';
import {LocalStorage} from 'node-localstorage';

jest.mock('~/components/shell/shell');
global.localStorage = new LocalStorage('./scratch');

window.MutationObserver = function () {};
window.MutationObserver.prototype.observe = function () {};
