import BaseView from '~/helpers/backbone/view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './impact.hbs';
import {template as strips} from '~/components/strips/strips.hbs';

const highlightedPartners = [{
    name: 'Auburn University',
    url: 'http://www.auburn.edu',
    logo: '/images/about-us/partners/auburn.png'
}, {
    name: 'BCcampus',
    url: 'https://bccampus.ca',
    logo: '/images/about-us/partners/bccampus.png'
}, {
    name: 'Central New Mexico Community College',
    url: 'http://www.cnm.edu',
    logo: '/images/about-us/partners/cnm.png'
}, {
    name: 'Grand Rapids Community College',
    url: 'http://www.grcc.edu',
    logo: '/images/about-us/partners/grcc.png'
}, {
    name: 'Maricopa Community Colleges',
    url: 'https://www.maricopa.edu',
    logo: '/images/about-us/partners/maricopa.png'
}, {
    name: 'Ohio State University',
    url: 'https://www.osu.edu',
    logo: '/images/about-us/partners/osu.png'
}, {
    name: 'Salt Lake Community College',
    url: 'http://www.slcc.edu',
    logo: '/images/about-us/partners/slcc.png'
}, {
    name: 'Tarrant County College',
    url: 'https://www.tccd.edu',
    logo: '/images/about-us/partners/tcc.png'
}, {
    name: 'UMass Amherst',
    url: 'http://www.umass.edu',
    logo: '/images/about-us/partners/umass.png'
}, {
    name: 'University of Idaho',
    url: 'https://www.uidaho.edu',
    logo: '/images/about-us/partners/idaho.png'
}, {
    name: 'University of Georgia',
    url: 'http://www.uga.edu',
    logo: '/images/about-us/partners/georgia.png'
}, {
    name: 'University of Oklahoma',
    url: 'https://www.ou.edu',
    logo: '/images/about-us/partners/ou.png'
}, {
    name: 'University of Texas at San Antonio',
    url: 'http://utsa.edu',
    logo: '/images/about-us/partners/utsa.png'
}, {
    name: 'Board of Regents of the University System of Georgia',
    url: 'http://www.usg.edu',
    logo: '/images/about-us/partners/georgia-regents.png'
}, {
    name: 'Virginia Tech',
    url: 'https://www.vt.edu',
    logo: '/images/about-us/partners/vt.png'
}];

@props({
    template: template,
    templateHelpers: {
        strips,
        highlightedPartners
    }
})
export default class Impact extends BaseView {}
