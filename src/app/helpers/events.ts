export function treatKeydownAsClick(event: React.KeyboardEvent, keyList: string[]) {
    if (keyList.includes(event.key)) {
        const saveActiveElement = document.activeElement as HTMLElement;

        event.target?.dispatchEvent(new window.MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }));
        event.preventDefault();
        event.stopPropagation();
        saveActiveElement.focus();
    }
}

export function treatSpaceOrEnterAsClick(event: React.KeyboardEvent) {
    treatKeydownAsClick(event, ['Enter', ' ']);
}
