import settings from 'settings';

const $ = {};

$.isPhoneDisplay = () => {
    return window.innerWidth <= 600;
};

$.isMobileDisplay = () => {
    return window.innerWidth <= 960;
};

$.isTestingEnvironment = () => (/(localhost|staging|dev|qa)/).test(window.location.hostname);

$.isPolish = (titleOrSlug) => (/fizyka/i).test(titleOrSlug) || (/polska/i).test(titleOrSlug);

$.focusable = 'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';

$.booleanAttribute = (whether) => whether ? '' : null;

$.apiOriginAndPrefix = `${settings.apiOrigin}/apps/cms/api/v2`;
$.apiOriginAndOldPrefix = $.apiOriginAndPrefix.replace('/v2', '');

$.treatSpaceOrEnterAsClick = (event) => {
    if (['Enter', ' '].includes(event.key)) {
        event.target.dispatchEvent(new MouseEvent('click', {
            'view': window,
            'bubbles': true,
            'cancelable': true
        }));
        event.preventDefault();
    }
};

const browserId = () => {
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
    const info = browserId();

    return ((info.name === 'Safari' && +info.version >= 10.1) ||
     (info.name === 'Edge' && +info.version >= 16) ||
     (info.name === 'Firefox' && +info.version >= 52) ||
     (info.name === 'Chrome' && +info.version >= 57));
};

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

$.scrollToFrame = ({divEl, newFrameNumber, oldFrameNumber, unit='vw'}) => {
    const SCROLL_TICKS = $.isMobileDisplay() ? 9 : 12;
    let posVw = oldFrameNumber * -100;
    const newPosVw = newFrameNumber * -100;
    const step = (newPosVw - posVw) / SCROLL_TICKS;
    const takeStep = () => {
        if (Math.abs(newPosVw - posVw) <= Math.abs(step)) {
            posVw = newPosVw;
            divEl.style.left = `${Math.round(posVw)}${unit}`;
        } else {
            posVw += step;
            divEl.style.left = `${Math.round(posVw)}${unit}`;
            window.requestAnimationFrame(takeStep);
        }
    };

    window.requestAnimationFrame(takeStep);
};

$.hashClick = (event, options = {doHistory: true}) => {
    const node = event.delegateTarget || event.currentTarget;
    const destUrl = `${node.pathname}${node.hash}`;
    const targetEl = document.getElementById(node.hash.substr(1));

    $.scrollTo(targetEl);
    if (options.doHistory) {
        history.pushState({}, '', destUrl);
    }
    event.preventDefault();
};

$.setPageDescription = (description) => {
    const descriptionEl = document.querySelector('head meta[name="description"]');
    const defaultDescription = 'Access our free college textbooks and low-cost learning materials.';

    if (descriptionEl) {
        descriptionEl.setAttribute('content', description || defaultDescription);
    } else {
        console.warn('No description meta entry in page header');
    }
};

$.setPageTitleAndDescription = (title, description) => {
    $.setPageDescription(description);
    document.title = title ? `${title} - OpenStax` : 'OpenStax';
};

const canonicalLinkHelpers = {
    get el() {
        const el = document.createElement('link');
        const titleEl = document.querySelector('head title');

        if (titleEl) {
            el.setAttribute('rel', 'canonical');
            titleEl.parentNode.insertBefore(el, titleEl.nextSibling);
        }
        return el;
    },
    setPath(newPath = window.location.pathname, myEl) {
        const el = myEl || canonicalLinkHelpers.el;
        const host = 'https://openstax.org';

        el.href = `${host}${newPath}`;
        return el;
    }
};

$.setCanonicalLink = (path, el) => {
    return canonicalLinkHelpers.setPath(path, el);
};

$.htmlToText = (html) => {
    const temp = document.createElement('div');

    temp.innerHTML = html;
    return temp.textContent;
};

// Making scripts work, per https://stackoverflow.com/a/47614491/392102
$.activateScripts = function (el) {
    const scripts = Array.from(el.querySelectorAll('script'));
    const processOne = (() => {
        if (scripts.length === 0) {
            return;
        }
        const s = scripts.shift();
        const newScript = document.createElement('script');
        const p = (s.src) ? new Promise((resolve) => {
            newScript.onload = resolve;
        }) : Promise.resolve();

        Array.from(s.attributes)
            .forEach((a) => newScript.setAttribute(a.name, a.value));
        newScript.appendChild(document.createTextNode(s.textContent));
        newScript.async = false;
        s.parentNode.replaceChild(newScript, s);

        p.then(processOne);
    });

    processOne();
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
            $.activateScripts(htmlEl);
        } catch (e) {
            console.warn('Eval', expr, e);
        }
    }
};


function splitSearchString() {
    return window.location.search.substr(1).split('&')
        .filter((piece) => piece.length > 0);
}

$.findSelectedTab = (labels) => {
    const possibleTabs = splitSearchString().map(decodeURIComponent);

    return labels.find((label) => possibleTabs.includes(label)) || labels[0];
};

$.replaceSearchTerm = (labels, selectedTab, newValue) => {
    const possibleTabs = splitSearchString();
    const index = possibleTabs.findIndex((t) => labels.includes(decodeURIComponent(t)));

    if (index < 0) {
        possibleTabs.unshift(encodeURIComponent(newValue));
    } else {
        possibleTabs[index] = encodeURIComponent(newValue);
    }
    return `?${possibleTabs.join('&')}`;
};


$.parseSearchString = (searchString) => {
    const result = {};

    searchString.substr(1).split('&').forEach((item) => {
        const [k, v] = item.split('=');

        (k in result) ? result[k].push(decodeURIComponent(v)) : result[k] = [decodeURIComponent(v)];
    });
    return result;
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

function camelCase(underscored) {
    return underscored.replace(/_([a-z0-9])/g, (_, chr) => chr ? chr.toUpperCase() : '');
}

function camelCaseKeys(obj) {
    if (!(obj instanceof Object)) {
        return obj;
    }

    if (obj instanceof Array) {
        return obj.map((v) => camelCaseKeys(v));
    }

    return Reflect.ownKeys(obj).reduce((result, k) => {
        result[camelCase(k)] = camelCaseKeys(obj[k]);
        return result;
    }, {});
}
$.camelCaseKeys = camelCaseKeys;

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
