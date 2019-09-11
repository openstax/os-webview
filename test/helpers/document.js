import {JSDOM} from 'jsdom';

const dom = new JSDOM();

global.document = dom.window.document;
global.window = dom.window;

const head = document.querySelector('head');
const title = document.createElement('title');

head.appendChild(title);
