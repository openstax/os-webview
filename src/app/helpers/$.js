const $ = {};

$.isTouchDevice = () => (
    ('ontouchstart' in window) ||
    (navigator.MaxTouchPoints > 0) ||
    (navigator.msMaxTouchPoints > 0)
);

$.isMobileDisplay = () => {
    return window.innerWidth <= 960;
};

$.isNode = () => (typeof process !== 'undefined') && (process.release.name === 'node');

$.isPolish = (titleOrSlug) => (/fizyka/i).test(titleOrSlug) || (/polska/i).test(titleOrSlug);

$.focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

$.booleanAttribute = (whether) => whether ? '' : null;

$.browserId = () => {
    const ua = navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let tem;
    const checkEdge = () => {
        if (/\bEdge\b/.test(ua)) {
            tem = ua.match(/Edge\/(\d+)/);
            M = ['Edge', 'Edge', (tem[1] || '')];
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

    return ((info.name === 'Safari' && +info.version >= 10.1) ||
     (info.name === 'Edge' && +info.version >= 16) ||
     (info.name === 'Firefox' && +info.version >= 52) ||
     (info.name === 'Chrome' && +info.version >= 57));
};

$.stringCompare = (a, b) => (a < b) ? -1 : +(a > b);

$.lowerCaseCompare = (a, b) => $.stringCompare(a.toLowerCase(), b.toLowerCase());

const tick = 1000 / 40;
const spaceForMenu = 59;
const targetStep = 100;
const targetTicks = 20;

$.isInViewport = (el) => {
    const rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 && rect.left >= 0 &&
            rect.bottom <= window.innerHeight &&
            rect.right <= window.innerWidth
    );
};

$.overlapsViewport = (el) => {
    const rect = el.getBoundingClientRect();

    return (
        (rect.top >= 0 && rect.top <= window.innerHeight) ||
        (rect.bottom >= 0 && rect.bottom <= window.innerHeight)
    );
};

$.scrollTo = (el, offset = 0) => {
    const getOffsetTop = () => {
        const rect = el.getBoundingClientRect();

        return rect.top - spaceForMenu - offset;
    };
    const offsetTop = getOffsetTop();
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
                // Just ensure that we are there
                const finalScrollBody = document.documentElement.scrollTop || document.body.scrollTop;
                const finalPosition = getOffsetTop() + finalScrollBody;

                window.scrollTo(0, finalPosition);
                clearInterval(i);
                resolve();
            }
        }, tick);
    });
};

$.scrollToHash = () => {
    if (window.location.hash) {
        const id = window.location.hash.substr(1);
        const target = document.getElementById(id);

        if (target) {
            window.requestAnimationFrame(() => $.scrollTo(target, -59)); // Don't need space for menu
        }
    }
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

$.setPageTitleAndDescription = (title, description) => {
    const descriptionEl = document.querySelector('head meta[name="description"]');
    const defaultDescription = 'Access our free college textbooks and low-cost learning materials.';

    if (descriptionEl) {
        descriptionEl.setAttribute('content', description || defaultDescription);
    } else {
        console.warn('No description meta entry in page header');
    }
    document.title = title ? `${title} - OpenStax` : 'OpenStax';
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

$.setCanonicalLink = (path, slug = '') => {
    const host = 'http://openstax.org';
    const el = document.createElement('link');
    const titleEl = document.querySelector('head title');

    // Insert after title
    titleEl.parentNode.insertBefore(el, titleEl.nextSibling);
    el.setAttribute('rel', 'canonical');
    el.setAttribute('href', `${host}${path}${slug}`);
    return el;
};

$.htmlToText = (html) => {
    const temp = document.createElement('div');

    temp.innerHTML = html;
    return temp.textContent;
};

$.insertHtml = (containerEl, model) => {
    /* eslint complexity: 0 */
    const containers = containerEl ? containerEl.querySelectorAll('[data-html]') : [];
    const modelValue = model instanceof Function ? model() : model;

    for (const htmlEl of containers) {
        /* eslint no-eval: 0 */
        const html = htmlEl.dataset ? htmlEl.dataset.html : htmlEl.getAttribute('data-html');
        const expr = `modelValue.${html}`;

        try {
            htmlEl.innerHTML = eval(expr) || '';
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

$.newEvent = (eventType) => {
    let event;

    if (typeof window.Event === 'function') {
        event = new Event(eventType, {bubbles: true});
    } else {
        event = document.createEvent('Event');
        event.initEvent(eventType, true, true);
    }

    return event;
};

$.fade = (element, {fromOpacity, toOpacity, steps=10}) => {
    return new Promise((resolve) => {
        let opacity = fromOpacity;
        const byStep = (toOpacity - fromOpacity)/steps;
        const doStep = function () {
            opacity += byStep;
            if ((byStep > 0 && opacity >= toOpacity) ||
                (byStep < 0 && opacity <= toOpacity)) {
                element.style.opacity = toOpacity;
                resolve();
                return true;
            }
            element.style.opacity = opacity;
            requestAnimationFrame(doStep);
            return false;
        };

        requestAnimationFrame(doStep);
    });
};

$.key = {
    esc: 27,
    space: 32,
    enter: 13,
    up: 38,
    down: 40,
    left: 37,
    right: 39,
    tab: 9
};

export default $;
