const focusableItems = [
    'button', 'input', 'select', 'textarea'
].map((s) => `${s}:not([disabled])`).concat([
    '[href]', '[tabindex]:not([tabindex="-1"])'
]).join(',');

export default function trapTab(el) {
    // eslint-disable-next-line complexity
    return (event) => {
        if (event.key !== 'Tab' || !el) {
            return;
        }

        const focusableElements = el.querySelectorAll(focusableItems);

        if (focusableElements.length < 1) {
            return;
        }
        const firstEl = focusableElements[0];
        const lastEl = focusableElements[focusableElements.length - 1];

        if (event.shiftKey && (document?.activeElement === firstEl)) {
            lastEl.focus();
            event.preventDefault();
        } else if (document?.activeElement === lastEl) {
            firstEl.focus();
            event.preventDefault();
        }
    };
}
