import VERSION from '~/version';
import {
    Controller
} from 'superb.js';
import $ from '~/helpers/$';
import {
    description as template
} from './map.html';
import mapboxgl from 'mapbox-gl';
import {
    on
} from '~/helpers/controller/decorators';
import Dropdown from './mapdropdown';


export default class Map1 extends Controller {

    init(props) {
        this.template = template;
        this.css = `/app/pages/impact-dev/map/map.css?${VERSION}`;

        this.view = {
            classes: ['mapbox']
        };
        this.regions = {
            dataList: '.dropDownList'
        };
        this.model = [];
        this.mapObject = props;
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        setTimeout(() => {
            const styleF = '-webkit-transition: opacity 3s ease-in-out;-moz-transition: opacity 3s ease-in-out;';
            const styleS = '-ms-transition: opacity 3s ease-in-out;-o-transition: opacity 3s ease-in-out;opacity: 0;';

            document.getElementById('onMap').setAttribute('style', styleF+styleS);
            document.getElementById('maptxt').setAttribute('style', styleF+styleS);
        }, 8000);
        setTimeout(() => {
            const styleT = 'transition: all 1.5s ease-out;-webkit-transition: all 1.5s ease-out;';
            const styleFr = '-moz-transition: all 1.5s ease-out;-o-transition: all 1.5s ease-out;left:2%;top:64px;';

            if (window.innerWidth > 960) {
                document.getElementById('search').setAttribute('style', styleT+styleFr);
            }
        }, 10000);
    }
    @on('keyup .srch')
    intercept(event) {
        const filterStatus = this.el.querySelector('.filter_btn');
        const filterDiv = this.el.querySelector('.filter_div');
        const filterStyle = this.el.querySelector('#filter_style');
        const searchInput = this.el.querySelector('.srch');

        this.validateMob();
        if (filterStatus.value === '1') {
            filterStyle.classList.toggle('fa-sliders-h');
            filterStyle.classList.toggle('fa-times');
            filterDiv.setAttribute('style', 'display: none');
            filterStatus.value = '0';
        }
        if (event.target.value === '') {
            this.model = [];
            const list = new Dropdown(this.model);

            if (window.innerWidth < 960) {
                this.el.querySelector('.search').setAttribute('style', 'top: 370px');
                searchInput.setAttribute('style', 'border: unset');
                this.el.querySelector('.searchimg').setAttribute('style', 'display: block');
            }
            this.regions.dataList.attach(list);
        } else if (event.target.textLength > 3) {
            (async () => {
                try {
                    const response = await fetch(`${settings.apiOrigin}/api/schools/?name=${event.target.value}`);
                    const data = await response.json();

                    if (data.length) {
                        if (window.innerWidth < 960) {
                            this.el.querySelector('.search').setAttribute('style', 'top: 170px');
                        }
                        this.model = {
                            mapObj: this.mapObject,
                            lData: data
                        };
                        const list = new Dropdown(this.model);

                        this.regions.dataList.attach(list);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        }
        console.warn('hello');
    }
    @on('click .filter_btn')
    filterOnOff(event) {
        console.log(event);
        const filterDiv = this.el.querySelector('.filter_div');
        const dListDiv = this.el.querySelector('.dropDownList');
        const filterStyle = this.el.querySelector('#filter_style');

        filterStyle.classList.toggle('fa-sliders-h');
        filterStyle.classList.toggle('fa-times');
        if (event.target.value === '0') {
            event.target.value = '1';
            dListDiv.innerHTML = '';
            filterDiv.setAttribute('style', 'display: block');
            if (window.innerWidth < 960) {
                this.el.querySelector('.search').setAttribute('style', 'top: 170px');
            }
        } else {
            event.target.value = '0';
            filterDiv.setAttribute('style', 'display: none');
            if (window.innerWidth < 960) {
                this.el.querySelector('.search').setAttribute('style', 'top: 370px');
            }
        }
    }
    validateMob() {
        if (window.innerWidth < 960) {
            this.el.querySelector('.srch').setAttribute('style', 'border: 1px solid #D5D5D5;border-radius: 3px;');
            this.el.querySelector('.searchimg').setAttribute('style', 'display: none');
        }
    }

}
