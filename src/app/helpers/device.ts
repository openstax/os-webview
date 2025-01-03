export function isMobileDisplay() {
    return window.innerWidth <= 960;
}

// If the browser supports grid layout, it's probably ok
export default function isSupported() {
    return window.CSS?.supports('( display: grid )') ?? false;
}
