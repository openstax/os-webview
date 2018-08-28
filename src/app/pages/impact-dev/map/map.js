import VERSION from '~/version';
import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './map.html';
import {on} from '~/helpers/controller/decorators';
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
        this.filterStatus = 'false';
        this.prtnrCheckBox = 'false';
        this.insType = 'all';
        this.oneMillionCheckBox = 'false';
        this.testmonalCheckBox = 'false';
    }

    onLoaded() {
        $.insertHtml(this.el, this.model);
        setTimeout(() => {
            const styleF = '-webkit-transition: opacity 3s ease-in-out;-moz-transition: opacity 3s ease-in-out;';
            const styleS = '-ms-transition: opacity 3s ease-in-out;-o-transition: opacity 3s ease-in-out;opacity: 0;';

            document.getElementById('onMap').setAttribute('style', styleF + styleS);
            document.getElementById('maptxt').setAttribute('style', styleF + styleS);
            document.getElementById('maptxt').setAttribute('style', 'display: none');
        }, 8000);
        setTimeout(() => {
            const styleT = 'transition: all 1.5s ease-out;-webkit-transition: all 1.5s ease-out;';
            const styleFr = '-moz-transition: all 1.5s ease-out;-o-transition: all 1.5s ease-out;margin-top: 3rem;';

            if (window.innerWidth > 960) {
                document.getElementById('search_container').setAttribute('style', styleT + styleFr);
            }
        }, 10000);
    }
    @on('keyup .srch')
    intercept(event) {
        const filterStatus = this.el.querySelector('.filter_btn');
        const searchInput = this.el.querySelector('.srch');

        this.validateMob();
        if (filterStatus.value === '1') {
            return;
        }
        if (event.target.value === '') {
            this.model = [];
            const list = new Dropdown(this.model);

            if (window.innerWidth < 960) {
                this.el.querySelector('.search').setAttribute('style', 'top: 370px');
                searchInput.setAttribute('style', 'border: unset');
                this.el.querySelector('.searchimg').setAttribute('style', 'display: initial');
            }
            this.regions.dataList.attach(list);
        } else if (event.target.textLength > 3) {
            this.searchRequest(this.filterStatus, event.target.value);
        }
    }
    @on('click .filter_btn')
    filterOnOff(event) {
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
            this.setFilterValuesOnClose();
            if (window.innerWidth < 960) {
                this.el.querySelector('.search').setAttribute('style', 'top: 370px');
            }
        }
    }
    @on('click .applyFltrBtn')
    applyFilter(event) {
        const filterValue = event.target.value;
        const searchInput = this.el.querySelector('.srch');

        if (filterValue === '0') {
            event.target.value = '1';
            this.filterStatus = 'true';
        }
        this.setFilterValues();
        this.closeFlterDiv();
        this.searchRequest(this.filterStatus, searchInput.value);
    }
    @on('click .toggleCheck')
    changeFltrToggle(event) {
        if (event.delegateTarget.value === 'false') {
            event.delegateTarget.value = 'true';
        } else {
            event.delegateTarget.value = 'false';
        }
    }
    searchRequest(fltrStatus, value) {
        let fltString = '';

        if (fltrStatus === 'true') {
            fltString = this.getFilterValues();
        }
        (async () => {
            try {
                const response = await fetch(`${settings.apiOrigin}/api/schools/?name=${value+fltString}`);
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
                } else {
                    const list = new Dropdown('empty_result');

                    this.regions.dataList.attach(list);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }
    closeFlterDiv() {
        const filterStyle = this.el.querySelector('#filter_style');
        const filterDiv = this.el.querySelector('.filter_div');
        const filterStatus = this.el.querySelector('.filter_btn');

        filterStyle.classList.toggle('fa-sliders-h');
        filterStyle.classList.toggle('fa-times');
        filterDiv.setAttribute('style', 'display: none');
        filterStatus.value = '0';
        this.setFilterValuesOnClose();
    }
    setFilterValuesOnClose() {
        const prtCheck = this.el.querySelector('#prtnrCheckBox');
        const oneMillionCheck = this.el.querySelector('#one_millionCheckBox');
        const tetmonal = this.el.querySelector('#testmonalCheckBox');

        prtCheck.value = this.prtnrCheckBox;
        this.changeToggleColor(prtCheck, this.prtnrCheckBox);

        this.el.querySelector('#type_institute_toggle').value = this.insType;

        oneMillionCheck.value = this.oneMillionCheckBox;
        this.changeToggleColor(oneMillionCheck, this.oneMillionCheckBox);

        tetmonal.value = this.testmonalCheckBox;
        this.changeToggleColor(tetmonal, this.testmonalCheckBox);
    }
    changeToggleColor(attrName, value) {
        if (value === 'false') {
            attrName.checked = false;
        } else {
            attrName.checked = true;
        }
    }
    setFilterValues() {
        this.prtnrCheckBox = this.el.querySelector('#prtnrCheckBox').value;
        this.insType = this.el.querySelector('#type_institute_toggle').value;
        this.oneMillionCheckBox = this.el.querySelector('#one_millionCheckBox').value;
        this.testmonalCheckBox = this.el.querySelector('#testmonalCheckBox').value;
    }
    getFilterValues() {
        let fltString = '';

        if (this.prtnrCheckBox === 'true') {
            fltString += '&key_institutional_partner=true';
        }
        if (this.insType !== 'all') {
            fltString += `&type=${this.el.querySelector('#type_institute_toggle').value}`;
        }
        if (this.oneMillionCheckBox === 'true') {
            fltString += '&achieving_the_dream_school=true';
        }
        if (this.testmonalCheckBox === 'true') {
            fltString += '&testimonial=true';
        }
        return fltString;
    }
    validateMob() {
        if (window.innerWidth < 960) {
            this.el.querySelector('.srch').setAttribute('style', 'border: 1px solid #D5D5D5;border-radius: 3px;');
            this.el.querySelector('.searchimg').setAttribute('style', 'display: none');
        }
    }

}
