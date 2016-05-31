import BannerView from '~/pages/home/banners/banner-view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './chemistry.hbs';

@props({
    template: template,
    css: '/app/pages/home/banners/chemistry/chemistry.css'
})
export default class Chemistry extends BannerView {}
