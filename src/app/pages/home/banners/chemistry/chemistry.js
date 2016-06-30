import BannerView from '~/pages/home/banners/banner-view';
import {props} from '~/helpers/backbone/decorators';
import {template} from '../banner.hbs';

@props({
    template: template,
    css: '/app/pages/home/banners/chemistry/chemistry.css',
    templateHelpers: {
        subject: 'chemistry',
        subjectTitle: 'Chemistry',
        quote: 'transform',
        features: ['element'],
        buttonSpec1: 'btn-gold',
        buttonSpec2: 'btn-turquoise',
        alignedEdge: 'right'
    }
})
export default class ChemistryBanner extends BannerView {}
