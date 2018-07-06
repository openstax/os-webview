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

function keyEvent(eventName, el, key) {
    el.dispatchEvent(
        new KeyboardEvent(eventName, {
            key: key,
            keyCode: keyCodes[key],
            bubbles: true,
            cancelable: true
        })
    );
}

function doKeyDown(el, key) {
    keyEvent('keydown', el, key);
}

function doKeyPress(el, key) {
    keyEvent('keypress', el, key);
}

function clickElement(el) {
    el.dispatchEvent(clickEvent());
}

export {clickElement, doKeyDown, doKeyPress};
