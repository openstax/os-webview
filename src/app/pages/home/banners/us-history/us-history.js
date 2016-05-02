import BannerView from '~/pages/home/banners/banner-view';
import {props} from '~/helpers/backbone/decorators';
import {template} from './us-history.hbs';
import './us-history.css!';

@props({
    template: template
})
export default class USHistory extends BannerView {}
