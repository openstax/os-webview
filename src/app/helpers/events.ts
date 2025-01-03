export function treatKeydownAsClick(event, keyList) {
    if (keyList.includes(event.key)) {
        const saveActiveElement = document.activeElement;

        event.target.dispatchEvent(new window.MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }));
        event.preventDefault();
        event.stopPropagation();
        saveActiveElement.focus();
    }
}

export function treatSpaceOrEnterAsClick(event) {
    treatKeydownAsClick(event, ['Enter', ' ']);
}
