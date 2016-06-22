require('jsdom-global')()

var RESERVED_KEYS = {
    length: true,
    key: true,
    setItem: true,
    getItem: true,
    removeItem: true,
    clear: true
}

var StorageShim = function () {
    Object.defineProperty(this, 'length', {
        enumerable: false,
        get: function () {
            return Object.keys(this).length
        }
    })

    Object.defineProperty(this, 'key', {
        enumerable: false,
        value: function (n) {
            var key = Object.keys(this)[n]
            return key || (key === '' ? key : null)
        }
    })

    Object.defineProperty(this, 'setItem', {
        enumerable: false,
        value: function (key, value) {
            if (key in RESERVED_KEYS) {
                throw new Error('Cannot assign to reserved key "' + key + '"')
            }

            this[key] = '' + value
        }
    })

    Object.defineProperty(this, 'getItem', {
        enumerable: false,
        value: function (key) {
            if (key in RESERVED_KEYS) {
                throw new Error('Cannot get reserved key "' + key + '"')
            }

            var item = this[key]
            return item || (item === '' ? item : null)
        }
    })

    Object.defineProperty(this, 'removeItem', {
        enumerable: false,
        value: function (key) {
            delete this[key]
        }
    })

    Object.defineProperty(this, 'clear', {
        enumerable: false,
        value: function () {
            for (var key in this) {
                delete this[key]
            }
        }
    })
}

global.window.localStorage = new StorageShim();
