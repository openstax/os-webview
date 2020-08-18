import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { library, dom } from '@fortawesome/fontawesome-svg-core';

function loadToLibrary(path) {
    // eslint-disable-next-line global-require
    const data = require(`@fortawesome/${path}`);

    library.add(data.definition);
}
function loaderForPath(path) {
    return (file) => loadToLibrary(`${path}/${file}`);
}

const loadSolidIcon = loaderForPath('free-solid-svg-icons');
const loadBrandIcon = loaderForPath('free-brands-svg-icons');
const loadRegularIcon = loaderForPath('free-regular-svg-icons');

[
    'faArrowUp',
    'faAtom',
    'faAward',
    'faBook',
    'faCaretDown',
    'faCaretLeft',
    'faCaretRight',
    'faCaretUp',
    'faChalkboardTeacher',
    'faChartBar',
    'faCheck',
    'faCheckCircle',
    'faChevronDown',
    'faChevronLeft',
    'faChevronRight',
    'faChevronUp',
    'faCloudDownloadAlt',
    'faDesktop',
    'faDownload',
    'faEllipsisV',
    'faExternalLinkAlt',
    'faGraduationCap',
    'faHandHoldingUsd',
    'faHeart',
    'faLaptop',
    'faLink',
    'faListOl',
    'faLock',
    'faMinus',
    'faMobileAlt',
    'faPlay',
    'faPlus',
    'faQuoteLeft',
    'faRssSquare',
    'faSearch',
    'faSignOutAlt',
    'faSlidersH',
    'faTabletAlt',
    'faTasks',
    'faTimes',
    'faUser',
    'faUserPlus',
    'faUsers',
    'faVolumeUp'
].forEach(loadSolidIcon);

[
    'faAmazon',
    'faApple',
    'faCanadianMapleLeaf',
    'faFacebook',
    'faFacebookF',
    'faInstagram',
    'faLinkedin',
    'faLinkedinIn',
    'faTwitter',
    'faTwitterSquare'
].forEach(loadBrandIcon);

[
    'faEnvelopeOpen'
].forEach(loadRegularIcon);

// This handles non-React tag replacement
dom.watch();
