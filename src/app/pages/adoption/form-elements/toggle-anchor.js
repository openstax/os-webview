export default function toggleAnchor(options) {
    let el = document.getElementById(options.id),
        divEl = document.getElementById(options.divId),
        isOpen = options.isOpen,
        defaultStyle = divEl.style.display;

    function setDisplay() {
        if (isOpen) {
            el.innerHTML = `- ${options.closeText}`;
            divEl.style.display = defaultStyle;
        } else {
            el.innerHTML = `+ ${options.openText}`;
            divEl.style.display = 'none';
        }
    }

    function toggle(event) {
        event.preventDefault();
        isOpen = !isOpen;
        setDisplay();
    }
    el.addEventListener('click', toggle);

    setDisplay();
}
