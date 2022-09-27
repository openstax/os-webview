export function isMobileDisplay() {
    return window.innerWidth <= 960;
}

function browserId() {
    const ua = window.navigator.userAgent;
    let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
    let tem;
    const checkEdge = () => {
        if ((/\bEdge\b/).test(ua)) {
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
    M = M[2] ? [M[1], M[2]] : [window.navigator.appName, window.navigator.appVersion, '-?'];
    if ((tem = ua.match(/version\/([\d.]+)/i)) !== null) {
        M.splice(1, 1, tem[1]);
    }

    return {name: M[0], version: M[1]};
}

// eslint-disable-next-line complexity
export default function isSupported() {
    const info = browserId();

    return (
        (info.name === 'Chrome' && parseFloat(info.version) >= 83) ||
        (info.name === 'Edge' && parseFloat(info.version) >= 83) ||
        (info.name === 'Firefox' && parseFloat(info.version) >= 74) ||
        (info.name === 'Safari' && parseFloat(info.version) >= 14.1)
    );
}
