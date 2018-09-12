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
        this.model = props.pageType;
        this.pageTyp = props.pageType;
        this.mapObject = props.mapObj;
        this.filterStatus = 'false';
        this.prtnrCheckBox = 'false';
        this.insType = 'all';
        this.oneMillionCheckBox = 'false';
        this.testmonalCheckBox = 'false';
    }

    onLoaded() {
        if (window.innerWidth < 960) {
            const filterStatus = this.el.querySelector('.srch');

            filterStatus.setAttribute('placeholder', 'Search location or instituion name');
        }
        $.insertHtml(this.el, this.model);
        if (this.pageTyp === 'landing') {
            setTimeout(() => {
                this.fadeOutText();
            }, 3000);
            setTimeout(() => {
                this.movBar();
            }, 3500);
        } else {
            this.fadOutMovBar();
        }
    }
    @on('click .srch')
    fadeEvent(event) {

    }
    @on('keyup .srch')
    intercept(event) {
        const filterStatus = this.el.querySelector('.filter-btn');

        this.validateMob();
        if (filterStatus.value === '1') {
            return;
        }
        if (event.target.value === '') {
            this.hideDataList();
        } else if (event.target.textLength > 3) {
            this.searchRequest(this.filterStatus, event.target.value);
        }
    }
    @on('click .filter-btn')
    filterOnOff(event) {
        const filterDiv = this.el.querySelector('.filter-div');
        const dListDiv = this.el.querySelector('.dropDownList');
        const filterStyle = this.el.querySelector('.filter-style');
        const bachToSearch = this.el.querySelector('.back-search-div');
        const searchContainer = this.el.querySelector('.search-container');

        filterStyle.classList.toggle('fa-sliders-h');
        filterStyle.classList.toggle('fa-times');
        if (event.target.value === '0') {
            event.target.value = '1';
            dListDiv.innerHTML = '';
            filterDiv.setAttribute('style', 'display: block');
            if (window.innerWidth < 960) {
                bachToSearch.setAttribute('style', 'display: block;');
            }
        } else {
            event.target.value = '0';
            filterDiv.setAttribute('style', 'display: none');
            this.setFilterValuesOnClose();
            if (window.innerWidth < 960) {
                bachToSearch.setAttribute('style', 'display: none;');
            }
        }
    }
    @on('click .applyfltrbtn')
    applyFilter(event) {
        const filterValue = event.target.value;
        const searchInput = this.el.querySelector('.srch');

        if (filterValue === '0') {
            event.target.value = '1';
            this.filterStatus = 'true';
        }
        this.setFilterValues();
        this.searchRequest(this.filterStatus, searchInput.value);
        this.resetFilterValues();
        this.closeFlterDiv();
    }
    @on('click .toggleCheck')
    changeFltrToggle(event) {
        if (event.delegateTarget.value === 'false') {
            event.delegateTarget.value = 'true';
        } else {
            event.delegateTarget.value = 'false';
        }
    }
    @on('click .back-search-btn')
    backToSearch(event) {
        this.el.querySelector('.srch').value = '';
        this.hideDataList();
    }
    @on('click .back-result-btn')
    backToSearchResult(event) {
        const searchInput = this.el.querySelector('.srch');

        document.getElementById('back-result-div').setAttribute('style', 'display: none;');
        this.el.querySelector('.search').setAttribute('style', 'display: flex;');
        this.searchRequest(this.filterStatus, searchInput.value);
    }
    @on('click .back-detail-btn')
    backToDetail(event) {
        document.getElementById('back-result-div').setAttribute('style', 'display: block;');
        document.getElementById('back-detail-div').setAttribute('style', 'display: none;');
        document.getElementById('detail-info-mob').setAttribute('style', 'display: block;');
        document.getElementById('testimonial-body-mob').setAttribute('style', 'display: none;');
    }
    fadeOutText() {
        const styleF = '-webkit-transition: opacity 3s ease-in-out;-moz-transition: opacity 3s ease-in-out;';
        const styleS = '-ms-transition: opacity 3s ease-in-out;-o-transition: opacity 3s ease-in-out;opacity: 0;';

        this.el.querySelector('.on-map').setAttribute('style', styleF + styleS);
        this.el.querySelector('.maptxt').setAttribute('style', styleF + styleS);
        setTimeout(() => {
            this.el.querySelector('.on-map').setAttribute('style', 'display: none');
            if (window.innerWidth > 960) {
                this.el.querySelector('.maptxt').setAttribute('style', 'display: none');
            }
        }, 3500);
    }
    movBar() {
        if (window.innerWidth > 960) {
            const styleT = 'transition: all 1.5s ease-out;-webkit-transition: all 1.5s ease-out;';
            const styleFr = '-moz-transition: all 1.5s ease-out;-o-transition: all 1.5s ease-out;margin-top: 3rem;';

            this.el.querySelector('.search-container').setAttribute('style', styleT + styleFr);
        }
    }
    fadOutMovBar() {
        this.el.querySelector('.on-map').setAttribute('style', 'display: none;');
        this.el.querySelector('.maptxt').setAttribute('style', 'display: none');
        if (window.innerWidth > 960) {
            this.el.querySelector('.search-container').setAttribute('style', 'margin-top: 13rem;');
        } else {
            this.el.querySelector('.search-container').setAttribute('style', 'height: 0; margin-bottom: 1rem;');
        }
    }
    searchRequest(fltrStatus, value) {
        const searchContainer = this.el.querySelector('.search-container');
        const bachToSearch = this.el.querySelector('.back-search-div');
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
                        bachToSearch.setAttribute('style', 'display: block;');
                    }
                    this.model = {
                        mapObj: this.mapObject,
                        lData: data
                    };
                    const list = new Dropdown(this.model);

                    this.regions.dataList.attach(list);
                } else {
                    const list = new Dropdown('empty_result');

                    if (window.innerWidth < 960) {
                        bachToSearch.setAttribute('style', 'display: block;');
                    }
                    this.regions.dataList.attach(list);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }
    hideDataList() {
        const searchInput = this.el.querySelector('.srch');

        this.model = [];
        const list = new Dropdown(this.model);

        if (window.innerWidth < 960) {
            searchInput.setAttribute('style', 'border: unset;width: 26.6;margin-right: unset;');
            this.el.querySelector('.back-search-div').setAttribute('style', 'display: none;');
            this.el.querySelector('.searchimg').setAttribute('style', 'display: initial');
        }
        this.regions.dataList.attach(list);
    }
    closeFlterDiv() {
        const filterStyle = this.el.querySelector('.filter-style');
        const filterDiv = this.el.querySelector('.filter-div');
        const filterStatus = this.el.querySelector('.filter-btn');

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

        this.el.querySelector('.type-institute-toggle').value = this.insType;

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
    resetFilterValues() {
        this.prtnrCheckBox = 'false';
        this.insType = 'all';
        this.oneMillionCheckBox = 'false';
        this.testmonalCheckBox = 'false';
    }
    setFilterValues() {
        this.prtnrCheckBox = this.el.querySelector('#prtnrCheckBox').value;
        this.insType = this.el.querySelector('.type-institute-toggle').value;
        this.oneMillionCheckBox = this.el.querySelector('#one_millionCheckBox').value;
        this.testmonalCheckBox = this.el.querySelector('#testmonalCheckBox').value;
    }
    getFilterValues() {
        let fltString = '';

        if (this.prtnrCheckBox === 'true') {
            fltString += '&key_institutional_partner=true';
        }
        if (this.insType !== 'all') {
            fltString += `&type=${this.el.querySelector('.type-institute-toggle').value}`;
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
            const styl = 'border: 0.1rem solid #d5d5d5; border-radius: 0.2rem; margin-right: 0.7rem;';

            this.el.querySelector('.srch').setAttribute('style', styl);
            this.el.querySelector('.searchimg').setAttribute('style', 'display: none');
        }
    }
    searchListHeight(length) {
        const searchContainer = this.el.querySelector('.search-container');

        switch (length) {
        case 1:
            searchContainer.setAttribute('style', 'margin-top: 38.5rem;');
            break;
        case 2:
            searchContainer.setAttribute('style', 'margin-top: 31.5rem;');
            break;
        default:
            searchContainer.setAttribute('style', 'margin-top: 24.5rem;');
            break;
        }
    }

}
