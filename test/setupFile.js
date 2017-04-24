global.fetch = require('jest-fetch-mock');

// Polyfill
Array.prototype.includes = function (member) {
    return this.indexOf(member) >= 0;
}

class LocalStorageMock {
  constructor() {
    this.store = {};
  }

  clear() {
    this.store = {};
  }

  getItem(key) {
    return this.store[key];
  }

  setItem(key, value) {
    this.store[key] = value.toString();
  }
};

global.localStorage = new LocalStorageMock;

window.MutationObserver = function () {};
window.MutationObserver.prototype.observe = function () {};
