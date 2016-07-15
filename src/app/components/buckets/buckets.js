import {Controller} from 'superb';
import Bucket from './bucket/bucket';

const bucketClasses = ['our-impact', 'partners'];
const buttonClasses = ['btn-cyan', 'btn-gold'];

export default class Buckets extends Controller {

    init(data) {
        this.template = () => '';
        this.css = '/app/components/buckets/buckets.css';
        this.view = {
            classes: ['buckets-section']
        };

        // FIX: Simplify options
        if (data) {
            this.data = data.map((item, index) => ({
                orientation: 'left',
                bucketClass: bucketClasses[index],
                hasImage: false,
                titleText: item.heading,
                blurbHtml: item.description,
                btnClass: buttonClasses[index],
                linkUrl: item.link,
                linkText: item.cta
            }));
        } else {
            this.data = [
                {
                    orientation: 'left',
                    bucketClass: 'our-impact',
                    hasImage: true,
                    titleText: 'Our Impact',
                    blurbHtml: `Prof. Wolchonok has saved students $15,000
                    and opened doors for them to pursue health science careers
                    by adopting our free Anatomy and Physiology book. `,
                    btnClass: 'btn-cyan',
                    linkUrl: '/impact',
                    linkText: 'See Our Impact'
                },
                {
                    orientation: 'full',
                    bucketClass: 'partners',
                    hasImage: false,
                    titleText: 'OpenStax Partners',
                    blurbHtml: `OpenStax partners have united with us to increase access
                    to high-quality learning materials. Their low-cost tools integrate
                    seamlessly with OpenStax books.`,
                    btnClass: 'btn-gold',
                    linkUrl: '/partners',
                    linkText: 'View Partners'
                }
            ];
        }
    }

    onLoaded() {
        for (const bucketData of this.data) {
            this.regions.self.append(new Bucket(bucketData));
        }
    }

}
