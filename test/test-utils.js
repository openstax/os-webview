function clickEvent() {
    return new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
}

const keyCodes = {
    ArrowDown: 40,
    ArrowUp: 38,
    Enter: 13,
    Escape: 27
};

function doKeyDown(el, key) {
    el.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: key,
            keyCode: keyCodes[key],
            bubbles: true,
            cancelable: true
        })
    );
}

function clickElement(el) {
    el.dispatchEvent(clickEvent());
}

export {clickElement, doKeyDown};
