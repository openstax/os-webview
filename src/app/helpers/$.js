let $ = {};

$.setAttr = (node, name, value) => {
    if (value === false || value === null) {
        node.removeAttribute(name);
    } else {
        node.setAttribute(name, value === true ? '' : value);
    }
};

$.isIE11 = () => !(window.ActiveXObject) && 'ActiveXObject' in window;

const tick = 1000 / 40,
    defaultStep = 200,
    spaceForMenu = 59,
    maxTicks = 20;

$.scrollTo = (el, customStep) => {
    let rect = el.getBoundingClientRect(),
        offsetTop = rect.top - spaceForMenu,
        direction = Math.sign(offsetTop),
        magnitude = Math.abs(offsetTop),
        chosenStep = customStep || defaultStep,
        tickCount = magnitude / chosenStep;

    if (tickCount > maxTicks) {
        chosenStep = magnitude / maxTicks;
    }

    let i = setInterval(() => {
        let step = (magnitude > chosenStep) ? chosenStep : magnitude,
            scrollBody = document.documentElement.scrollTop || document.body.scrollTop;

        window.scrollTo(0, scrollBody + direction * step);
        magnitude -= step;
        if (magnitude <= 0) {
            clearInterval(i);
        }
    }, tick);
};

$.hashTarget = (event) => {
    let node = event.target;

    while (node.tagName !== 'A') {
        node = node.parentNode;
    }

    return document.getElementById(node.hash.substr(1));
};

export default $;
