export function treatKeydownAsClick(event, keyList) {
    if (keyList.includes(event.key)) {
        event.target.dispatchEvent(new window.MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }));
        event.preventDefault();
        event.stopPropagation();
    }
}

export function treatSpaceOrEnterAsClick(event) {
    treatKeydownAsClick(event, ['Enter', ' ']);
}
