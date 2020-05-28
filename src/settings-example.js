const settings = {
    accountHref: 'https://accounts-qa.openstax.org',
    analyticsID: 'UA-73668038-3',
    apiOrigin: 'https://cms-dev.openstax.org',
    mapboxPK: 'pk.eyJ1Ijoib3BlbnN0YXgiLCJhIjoiY2pnbWtjajZzMDBkczJ6cW1kaDViYW02aCJ9.0w3LCa7lzozzRgXM7xvBfQ'
};

window.SETTINGS = settings;

// Do not include this line in settings.js
// It is necessary here, because Jest uses this file for tests
export default settings;
