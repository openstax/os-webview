import BannerView from '~/pages/home/banners/banner-view';
import {props} from '~/helpers/backbone/decorators';
import {template} from '../banner.hbs';

@props({
    template: template,
    css: '/app/pages/home/banners/us-history/us-history.css',
    templateHelpers: {
        subject: 'us-history',
        subjectTitle: 'U.S. History',
        quote: 'see into the past',
        features: ['clermont', 'sacajawea', 'john-adams'],
        buttonSpec1: 'btn-yellow',
        buttonSpec2: 'btn-turquoise',
        alignedEdge: 'right'
    }
})
export default class HistoryBanner extends BannerView {}
