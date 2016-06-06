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

$.stringCompare = (a, b) => (a < b) ? -1 : +(a > b);

$.lowerCaseCompare = (a, b) => $.stringCompare(a.toLowerCase(), b.toLowerCase());

const tick = 1000 / 40,
    spaceForMenu = 59,
    targetStep = 200,
    targetTicks = 20;

$.scrollTo = (el, offset = 0) => {
    let rect = el.getBoundingClientRect(),
        offsetTop = rect.top - spaceForMenu - offset,
        direction = Math.sign(offsetTop),
        magnitude = Math.abs(offsetTop),
        chosenStep = (targetStep + magnitude / targetTicks) / 2;

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
        setScrollStart = (e) => {
            scrollStart = e.currentTarget.scrollTop + e.touches[0].pageY;
        },
        scroll = (e) => {
            e.currentTarget.scrollTop = scrollStart - event.touches[0].pageY;
            event.preventDefault();
        };

    for (let el of view.el.querySelectorAll('.mac-scroll')) {
        view.attachListenerTo(el, 'scroll', setFreezePosition);
        view.attachListenerTo(el, 'mouseleave', handleMouseLeave);
        view.attachListenerTo(el, 'mousewheel', handleWheelEvent);
        view.attachListenerTo(window, 'touchstart', touchOutside(el));
        if ($.isTouchDevice() && window.innerWidth < 769) {
            view.attachListenerTo(el, 'touchstart', setScrollStart);
            view.attachListenerTo(el, 'touchmove', scroll);
        }
    }
    view.attachListenerTo(window, 'scroll', () => {
        if (freezePosition !== null) {
            window.scrollTo(0, freezePosition);
        }
    });
};

$.hashClick = (event, options = {doHistory: true}) => {
    let node = event.currentTarget,
        destUrl = `${node.pathname}${node.hash}`,
        targetEl = document.getElementById(node.hash.substr(1));

    $.scrollTo(targetEl);
    if (options.doHistory) {
        history.pushState({}, '', destUrl);
    }
    event.preventDefault();
};

const invalidEmailPatterns = [
    /@(aol|gmail|hotmail|yahoo).com/i
];

$.testInstitutionalEmail = (element) => {
    let ieValue = element.value;

    for (let re of invalidEmailPatterns) {
        if (re.test(ieValue)) {
            return false;
        }
    }

    return true;
};

export default $;
