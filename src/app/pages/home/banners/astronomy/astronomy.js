import BannerView from '~/pages/home/banners/banner-view';
import {props} from '~/helpers/backbone/decorators';
import {template} from '../banner.hbs';

@props({
    template: template,
    css: '/app/pages/home/banners/astronomy/astronomy.css',
    templateHelpers: {
        subject: 'astronomy',
        subjectTitle: 'astronomy',
        quote: 'see beyond this world',
        features: ['chart', 'equation'],
        buttonSpec1: 'btn-gold',
        buttonSpec2: 'btn-cyan',
        alignedEdge: 'right'
    }
})
export default class AstronomyBanner extends BannerView {}
