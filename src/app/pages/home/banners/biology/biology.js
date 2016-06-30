import BannerView from '~/pages/home/banners/banner-view';
import {props} from '~/helpers/backbone/decorators';
import {template} from '../banner.hbs';

@props({
    template: template,
    css: '/app/pages/home/banners/biology/biology.css',
    templateHelpers: {
        subject: 'biology',
        subjectTitle: 'Biology',
        quote: 'live the wild life',
        features: ['diagram', 'leaf'],
        buttonSpec1: 'btn-gold',
        buttonSpec2: 'btn-turquoise',
        alignedEdge: 'left'
    }
})
export default class BiologyBanner extends BannerView {}
