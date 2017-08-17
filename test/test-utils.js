function clickEvent() {
    return new MouseEvent('click', {
        'view': window,
        'bubbles': true,
        'cancelable': true
    });
}

function doKeyDown(el, key) {
    el.dispatchEvent(
        new KeyboardEvent('keydown', {
            key: key,
            bubbles: true,
            cancelable: true
        })
    );
}

function clickElement(el) {
    el.dispatchEvent(clickEvent());
}

export {clickElement, doKeyDown};
