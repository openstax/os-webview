Object.defineProperty(document, 'currentScript', {
  value: document.createElement('script'),
});

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
