let $ = {};

$.setAttr = (node, name, value) => {
    if (value === false || value === null) {
        node.removeAttribute(name);
    } else {
        node.setAttribute(name, value === true ? '' : value);
    }
};

const tick = 1000 / 40,
    defaultStep = 200,
    spaceForMenu = 59;

$.scrollTo = (el, customStep) => {
    let rect = el.getBoundingClientRect(),
        offsetTop = rect.top - spaceForMenu,
        direction = Math.sign(offsetTop),
        magnitude = Math.abs(offsetTop),
        i = setInterval(() => {
            let chosenStep = customStep || defaultStep,
                step = (magnitude > chosenStep) ? chosenStep : magnitude,
                scrollBody = document.documentElement.scrollTop || document.body.scrollTop;

            window.scrollTo(0, scrollBody + direction * step);
            magnitude -= step;
            if (magnitude <= 0) {
                clearInterval(i);
            }
        }, tick);
};

export default $;
