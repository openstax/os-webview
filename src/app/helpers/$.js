const $ = {};

$.isTouchDevice = () => (
    ('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
);

$.browserId = () => {
    const ua = navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let tem;
    const checkEdge = () => {
        if (/\bEdge\b/.test(ua)) {
            tem = ua.match(/Edge\/(\d+)/);
            M = ['Edge', 'IE', (tem[1] || '')];
        }
    };
    const checkIE = () => {
        if (/trident/i.test(M[1])) {
            tem = ua.match(/\brv[ :]+(\d+)/) || [];
            M = ['IE', 'IE', (tem[1] || '')];
        }
    };
    const checkChrome = () => {
        if (M[1] === 'Chrome' && (tem = ua.match(/\b(OPR|Edge)\/(\d+)/))) {
            M = [tem[1].replace('OPR', 'Opera'), tem[2]];
        }
    };
    const checkFirefox = () => {
        if (M[1] === 'Firefox') {
            M = ua.match(/.*\b(\w+)\/(\S+)/);
        }
    };

    checkEdge();
    checkIE();
    checkChrome();
    checkFirefox();
    M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/(\d+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
    }

    return {name: M[0], version: M[1]};
};

$.isSupported = () => {
    const info = $.browserId();

    return ((info.name === 'Safari' && +info.version >= 9) ||
     (info.name === 'IE' && +info.version >= 11) ||
     (info.name === 'Firefox' && +info.version >= 37) ||
     (info.name === 'Chrome' && +info.version >= 40));
};

$.stringCompare = (a, b) => (a < b) ? -1 : +(a > b);

$.lowerCaseCompare = (a, b) => $.stringCompare(a.toLowerCase(), b.toLowerCase());

const tick = 1000 / 40;
const spaceForMenu = 59;
const targetStep = 200;
const targetTicks = 20;

$.scrollTo = (el, offset = 0) => {
    const rect = el.getBoundingClientRect();
    const offsetTop = rect.top - spaceForMenu - offset;
    const direction = Math.sign(offsetTop);
    let magnitude = Math.abs(offsetTop);
    const chosenStep = (targetStep + magnitude / targetTicks) / 2;

    return new Promise((resolve) => {
        const i = setInterval(() => {
            const step = (magnitude > chosenStep) ? chosenStep : magnitude;
            const scrollBody = document.documentElement.scrollTop || document.body.scrollTop;

            window.scrollTo(0, scrollBody + direction * step);
            magnitude -= step;
            if (magnitude <= 0) {
                clearInterval(i);
                resolve();
            }
        }, tick);
    });
};

$.applyScrollFix = (view) => {
    let freezePosition = null;
    const setFreezePosition = () => {
        freezePosition = document.documentElement.scrollTop || document.body.scrollTop;
    };
    const handleMouseLeave = (e) => {
        if (!e.currentTarget.contains(e.relatedTarget)) {
            freezePosition = null;
        }
    };
    const handleWheelEvent = (e) => {
        const el = e.currentTarget;
        const delta = e.deltaY || e.wheelDelta / 4;

        el.scrollTop = el.scrollTop + delta;
        e.preventDefault();
    };
    const touchOutside = (el) => (
        (e) => {
            if (!el.contains(e.target)) {
                freezePosition = null;
            }
        }
    );
    let scrollStart;
    const setScrollStart = (e) => {
        scrollStart = e.currentTarget.scrollTop + e.touches[0].pageY;
    };
    const scroll = (e) => {
        e.currentTarget.scrollTop = scrollStart - event.touches[0].pageY;
        event.preventDefault();
    };

    for (const el of view.el.querySelectorAll('.mac-scroll')) {
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
    const node = event.delegateTarget;
    const destUrl = `${node.pathname}${node.hash}`;
    const targetEl = document.getElementById(node.hash.substr(1));

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
    const ieValue = element.value;

    for (const re of invalidEmailPatterns) {
        if (re.test(ieValue)) {
            return false;
        }
    }

    return true;
};

$.htmlToText = (html) => {
    const temp = document.createElement('div');

    temp.innerHTML = html;
    return temp.textContent;
};

$.insertHtml = (containerEl, model) => {
    for (const htmlEl of containerEl.querySelectorAll('[data-html]')) {
        /* eslint no-eval: 0 */
        const expr = `model.${htmlEl.dataset.html}`;

        try {
            htmlEl.innerHTML = eval(expr);
        } catch (e) {
            console.warn('Eval', expr, e);
        }
    }
};

$.parseSearchString = (searchString) => {
    const result = {};

    searchString.substr(1).split('&').forEach((item) => {
        const [k, v] = item.split('=');

        (k in result) ? result[k].push(decodeURIComponent(v)) : result[k] = [decodeURIComponent(v)];
    });
    return result;
};

export default $;
