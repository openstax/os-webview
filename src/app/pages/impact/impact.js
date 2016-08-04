import LoadingView from '~/controllers/loading-view';
import {description as template} from './impact.html';

const partners = [{
    name: 'Alamo Colleges',
    url: 'http://www.alamo.edu',
    logo: '/images/impact/partners/alamo.png'
}, {
    name: 'College of the Canyons',
    url: 'https://www.canyons.edu',
    logo: '/images/impact/partners/canyons.png'
}, {
    name: 'Lansing Community College',
    url: '	http://www.lcc.edu',
    logo: '/images/impact/partners/lansing.png'
}, {
    name: 'Northern Essex Community College',
    url: 'http://www.necc.mass.edu',
    logo: '/images/impact/partners/n-essex.png'
}, {
    name: 'Pasadena City College',
    url: 'http://www.pasadena.edu',
    logo: '/images/impact/partners/pasadena.png'
}, {
    name: 'South Florida State College',
    url: 'http://www.southflorida.edu',
    logo: '/images/impact/partners/s-florida.png'
}, {
    name: 'Tulsa Community College',
    url: 'http://www.tulsacc.edu',
    logo: '/images/impact/partners/tulsa-cc.png'
}, {
    name: 'University of Connecticut',
    url: 'http://uconn.edu',
    logo: '/images/impact/partners/uconn.png'
}, {
    name: 'University of Arizona',
    url: 'http://www.arizona.edu',
    logo: '/images/impact/partners/arizona.png'
}, {
    name: 'Utah State University',
    url: 'https://www.usu.edu',
    logo: '/images/impact/partners/utah-state.png'
}, {
    name: 'Washington State University',
    url: 'https://wsu.edu',
    logo: '/images/impact/partners/washington-state.png'
}, {
    name: 'Auburn University',
    url: 'http://www.auburn.edu',
    logo: '/images/impact/partners/auburn.png'
}, {
    name: 'BCcampus',
    url: 'https://bccampus.ca',
    logo: '/images/impact/partners/bccampus.png'
}, {
    name: 'Central New Mexico Community College',
    url: 'http://www.cnm.edu',
    logo: '/images/impact/partners/cnm.png'
}, {
    name: 'Grand Rapids Community College',
    url: 'http://www.grcc.edu',
    logo: '/images/impact/partners/grcc.png'
}, {
    name: 'Maricopa Community Colleges',
    url: 'https://www.maricopa.edu',
    logo: '/images/impact/partners/maricopa.png'
}, {
    name: 'Ohio State University',
    url: 'https://www.osu.edu',
    logo: '/images/impact/partners/osu.png'
}, {
    name: 'Salt Lake Community College',
    url: 'http://www.slcc.edu',
    logo: '/images/impact/partners/slcc.png'
}, {
    name: 'Tarrant County College',
    url: 'https://www.tccd.edu',
    logo: '/images/impact/partners/tarrant.png'
}, {
    name: 'UMass Amherst',
    url: 'http://www.umass.edu',
    logo: '/images/impact/partners/umass.png'
}, {
    name: 'University of Idaho',
    url: 'https://www.uidaho.edu',
    logo: '/images/impact/partners/idaho.png'
}, {
    name: 'University of Georgia',
    url: 'http://www.uga.edu',
    logo: '/images/impact/partners/georgia.png'
}, {
    name: 'University of Oklahoma',
    url: 'https://www.ou.edu',
    logo: '/images/impact/partners/oklahoma.png'
}, {
    name: 'University of Texas at San Antonio',
    url: 'http://utsa.edu',
    logo: '/images/impact/partners/utsa.png'
}, {
    name: 'Board of Regents of the University System of Georgia',
    url: 'http://www.usg.edu',
    logo: '/images/impact/partners/ugsystem.png'
}, {
    name: 'Virginia Tech',
    url: 'https://www.vt.edu',
    logo: '/images/impact/partners/vt.png'
}];

export default class Impact extends LoadingView {

    static description = 'Since 2012, OpenStax has saved students millions ' +
        'through free, peer-reviewed college textbooks. Learn more about our ' +
        'impact on the 3,000+ schools who use our books.';

    init() {
        document.querySelector('head meta[name="description"]').content = Impact.description;
        this.template = template;
        this.css = '/app/pages/impact/impact.css';
        this.view = {
            classes: ['impact-page', 'page']
        };
        this.model = partners;
    }

}
