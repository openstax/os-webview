let $ = {};

$.setAttr = (node, name, value) => {
    if (value === false || value === null) {
        node.removeAttribute(name);
    } else {
        node.setAttribute(name, value === true ? '' : value);
    }
};

$.isIE11 = () => !(window.ActiveXObject) && 'ActiveXObject' in window;

$.isTouchDevice = () => (
    ('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
 );

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

$.applyScrollFix = (view) => {
    let freezePosition = null,
        setFreezePosition = () => {
            freezePosition = document.documentElement.scrollTop || document.body.scrollTop;
        },
        handleMouseLeave = (e) => {
            if (!e.currentTarget.contains(e.relatedTarget)) {
                freezePosition = null;
            }
        },
        handleWheelEvent = (e) => {
            let el = e.currentTarget,
                delta = e.deltaY || e.wheelDelta / 4;

            el.scrollTop = el.scrollTop + delta;
            e.preventDefault();
        },
        touchOutside = (el) => (
            (e) => {
                if (!el.contains(e.target)) {
                    freezePosition = null;
                }
            }
        ),
        scrollStart,
        startScrolling = (e) => {
            scrollStart = e.changedTouches[0].pageY + e.currentTarget.scrollTop;
        },
        continueScrolling = (e) => {
            let el = e.currentTarget,
                newY = e.targetTouches[0].pageY;

            el.scrollTop = scrollStart - newY;
            e.preventDefault();
        };

    for (let el of view.el.querySelectorAll('.mac-scroll')) {
        view.attachListenerTo(el, 'touchstart', startScrolling);
        view.attachListenerTo(el, 'touchmove', continueScrolling);
        view.attachListenerTo(el, 'scroll', setFreezePosition);
        view.attachListenerTo(el, 'mouseleave', handleMouseLeave);
        view.attachListenerTo(el, 'mousewheel', handleWheelEvent);
        view.attachListenerTo(window, 'touchstart', touchOutside(el));
    }
    view.attachListenerTo(window, 'scroll', () => {
        if (freezePosition !== null) {
            window.scrollTo(0, freezePosition);
        }
    });
};

$.hashTarget = (event) => {
    let node = event.target;

    while (node.tagName !== 'A') {
        node = node.parentNode;
    }

    return document.getElementById(node.hash.substr(1));
};

export default $;
