import {Controller} from 'superb.js';
import {description as template} from './stat.html';
import css from './stat.css';

export default class State extends Controller {

    init() {
        this.template = template;
        this.css = css;
        this.view = {
            classes: ['statbox']
        };
        this.model = [
            {
                imageUrl: '/images/home/statmap1.png',
                uText1: '3.7',
                uText2: 'Million',
                lowerText: 'Students use OpenStax textbooks'
            },
            {
                imageUrl: '/images/home/statmap2.png',
                uText1: '47',
                uText2: '%',
                lowerText: 'Of degree-granting institutions in the US use Openstax'
            },
            {
                imageUrl: '/images/home/statmap3.png',
                uText1: '$389',
                uText2: 'Million',
                lowerText: 'Students have saved since 2012'
            },
            {
                imageUrl: '/images/home/statmap4.png',
                uText1: '12,000',
                uText2: '+',
                lowerText: 'Higher ed institutions use OpenStax'
            }
        ];
    }

}
