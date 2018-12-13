import {Controller} from 'superb.js';
import $ from '~/helpers/$';
import {description as template} from './map.html';
import {on} from '~/helpers/controller/decorators';
import Dropdown from './mapdropdown';
import Schoolinfo from './schoolinfo';
import Testimonialinfo from './testimonial';
import SchoolinfoHead from './schoolinfo-head';
import mapboxgl from 'mapbox-gl';
import {debounce} from 'lodash';
import css from './map.css';

export default class Map1 extends Controller {

    init(props) {
        this.template = template;
        this.css = css;

        this.view = {
            classes: ['mapbox']
        };
        this.regions = {
            dataList: '.dropDownList'
        };
        this.model = props.pageType;
        this.pageTyp = props.pageType;
        this.mapObject = props.mapObj;
        this.tooltip = 'close';
        this.filterStatus = 'false';
        this.prtnrCheckBox = 'false';
        this.insType = '';
        this.oneMillionCheckBox = 'false';
        this.testmonalCheckBox = 'false';
        this.mapFilterData = [];
    }

    onLoaded() {
        const glbalObj = this;
        const filterBtn = this.el.querySelector('.filter-btn');

        if ($.isMobileDisplay() && this.pageTyp === 'separate') {
            const filterStatus = this.el.querySelector('.srch');

            filterStatus.setAttribute('placeholder', 'Search location or instituion name');
        }
        if (this.pageTyp === 'separate') {
            this.fadOutMovBar();
            this.el.querySelector('.search-cross-div').setAttribute('hidden', '');
        }

        this.mapObject.on('click', 'os-schools', (el) => {
            (async () => {
                try {
                    const value = el.features[0].properties.id;
                    const response = await fetch(`${settings.apiOrigin}/api/schools/?id=${value}`);
                    const data = await response.json();

                    if (data.length) {
                        const modelObj = {
                            dataArray: data,
                            itemIndex: 0
                        };

                        if (filterBtn.value === '1') {
                            glbalObj.filterDivClose(filterBtn);
                        }
                        glbalObj.closeTooltip();
                        glbalObj.markerTooltip(data);
                        glbalObj.markerClickMOb(modelObj, data, glbalObj);
                    }
                } catch (e) {
                    console.log(e);
                }
            })();
        });
    }
    @on('click .srch')
    srchEvent(event) {
        this.closeTooltip();
    }
    @on('keyup .srch')
    intercept(event) {
        const filterStatus = this.el.querySelector('.filter-btn');
        const strLength = event.target.value.length;

        this.validateMob();
        if (filterStatus.value === '1') {
            return;
        }
        if (strLength >= 1) {
            this.el.querySelector('.search-cross-div').removeAttribute('hidden');
        }
        if (event.target.value === '') {
            this.hideDataList();
        } else if (strLength > 3) {
            const vall = debounce(() => {
                this.searchRequest(this.filterStatus, event.target.value);
            }, 1000);

            vall();
        }
    }

    @on('click .filter-btn')
    filterOnOff(event) {
        const serchInput = this.el.querySelector('.srch');
        const filterDiv = this.el.querySelector('.filter-div');
        const dListDiv = this.el.querySelector('.dropDownList');
        const filterStyle = this.el.querySelector('.filter-style');
        const bachToSearch = this.el.querySelector('.back-search-div');

        // TODO: This should be done using model variables in the template
        if (event.delegateTarget.value === '0') {
            filterStyle.classList.toggle('fa-sliders-h');
            filterStyle.classList.toggle('fa-times');
            event.delegateTarget.value = '1';
            dListDiv.innerHTML = '';
            dListDiv.classList.remove('single-item-info');
            filterDiv.setAttribute('style', 'display: block');
            if ($.isMobileDisplay()) {
                bachToSearch.setAttribute('style', 'display: block;');
            }
        } else {
            this.filterDivClose(event.delegateTarget);
        }
    }
    filterDivClose(event) {
        const filterDiv = this.el.querySelector('.filter-div');
        const bachToSearch = this.el.querySelector('.back-search-div');
        const filterStyle = this.el.querySelector('.filter-style');

        filterStyle.classList.toggle('fa-sliders-h');
        filterStyle.classList.toggle('fa-times');
        event.value = '0';
        filterDiv.setAttribute('style', 'display: none');
        this.setFilterValuesOnClose();
        if ($.isMobileDisplay()) {
            bachToSearch.setAttribute('style', 'display: none;');
        }
    }
    @on('click .clear-flt-btn')
    clearFilter(event) {
        const searchInput = this.el.querySelector('.srch');
        const filterStatusBtn = this.el.querySelector('.apply-flt-enabled');

        this.el.querySelector('.srch').value = '';
        this.el.querySelector('.search-cross-div').setAttribute('hidden', '');
        this.resetFilterValues();
        this.setFilterValuesOnClose();
        this.filterStatus = 'false';
        this.filterMapLayer('clear');
        filterStatusBtn.value = '0';
    }
    @on('click .apply-flt-enabled')
    applyFilter(event) {
        const searchInput = this.el.querySelector('.srch');

        this.setFilterValues();
        if (this.getFilterValues() === '') {
            this.filterStatus = 'false';
        } else {
            this.filterStatus = 'true';
        }
        this.searchRequest(this.filterStatus, searchInput.value);
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
    @on('click .search-cross-img')
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
    @on('click .back-detail-single-btn')
    backToSingleDetail(event) {
        document.getElementById('back-search-div').setAttribute('style', 'display: block;');
        document.getElementById('back-detail-single-div').setAttribute('style', 'display: none;');
        document.getElementById('detail-info-mob').setAttribute('style', 'display: block;');
        document.getElementById('testimonial-body-mob').setAttribute('style', 'display: none;');
    }
    showDetailMob(mapDropDown) {
        const detailinfoMOb = mapDropDown.el.querySelector('.detail-info-mob');
        const searchList = mapDropDown.el.querySelector('.search-list');

        searchList.setAttribute('style', 'display: none');
        this.el.querySelector('.search').setAttribute('style', 'display: none;');
        detailinfoMOb.setAttribute('style', 'display: block');
        document.getElementById('back-search-div').setAttribute('style', 'display: block;');
        document.getElementById('back-result-div').setAttribute('style', 'display: none;');
        document.getElementById('back-detail-div').setAttribute('style', 'display: none;');
    }
    markerTooltip(data) {
        const dField = data[0].fields;
        const iName = dField.name;
        const pCity = dField.physical_city;
        const pState = dField.physical_state_province;
        const mtooltip = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });

        mtooltip.setLngLat([dField.lat, dField.long]);
        mtooltip.setHTML(`<b>${iName}</b><br>${pCity}${pState === null ? '' : `, ${pState}`}`);
        mtooltip.addTo(this.mapObject);
        this.tooltip = mtooltip;
    }
    closeTooltip() {
        if (this.tooltip !== 'close') {
            this.tooltip.remove();
        }
    }

    fadOutMovBar() {
        const styleM = 'height: 0; margin-bottom: 1rem; margin-top: 0;';

        this.el.querySelector('.on-map').setAttribute('style', 'display: none;');
        this.el.querySelector('.maptxt').setAttribute('style', 'display: none');
        if (!$.isMobileDisplay()) {
            this.el.querySelector('.search-container').setAttribute('style', 'margin-top: 3rem;');
        } else {
            this.el.querySelector('.search-container').setAttribute('style', styleM);
        }
    }
    searchRequest(fltrStatus, value) {
        const bachToSearch = this.el.querySelector('.back-search-div');
        let fltString = '';

        if (fltrStatus === 'true') {
            fltString = this.getFilterValues();
        }
        (async () => {
            try {
                const callName = this.requestCall(fltrStatus, value, fltString);
                const response = await fetch(callName);
                const data = await response.json();

                this.filterMapLayer(data);
                if (data.length) {
                    if ($.isMobileDisplay()) {
                        bachToSearch.setAttribute('style', 'display: block;');
                    }
                    this.makeFitBoundsArray(data);
                    this.model = {
                        mapObj: this.mapObject,
                        lData: data
                    };
                    const list = new Dropdown(this.model);

                    this.el.querySelector('.dropDownList').classList.remove('single-item-info');
                    this.regions.dataList.attach(list);
                } else {
                    const list = new Dropdown('empty_result');

                    if ($.isMobileDisplay()) {
                        bachToSearch.setAttribute('style', 'display: block;');
                    }
                    this.regions.dataList.attach(list);
                }
            } catch (e) {
                console.log(e);
            }
        })();
    }
    requestCall(fltStatus, value, fltString) {
        let callName;

        if (fltStatus !== 'true') {
            callName = `${settings.apiOrigin}/api/schools/?q=${value}`;
        } else {
            callName = `${settings.apiOrigin}/api/schools/?name=${value+fltString}`;
        }
        return callName;
    }
    hideDataList() {
        const searchInput = this.el.querySelector('.srch');

        this.el.querySelector('.search-cross-div').setAttribute('hidden', '');
        this.el.querySelector('.dropDownList').classList.remove('single-item-info');
        this.filterMapLayer('clear');
        this.model = [];
        const list = new Dropdown(this.model);

        if ($.isMobileDisplay()) {
            searchInput.setAttribute('style', 'border: unset;width: 26.6;margin-right: unset;');
            this.el.querySelector('.search').setAttribute('style', 'display: flex;');
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
        const tetmonal = this.el.querySelector('#testimonialCheckBox');

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
        this.insType = '';
        this.oneMillionCheckBox = 'false';
        this.testmonalCheckBox = 'false';
    }
    setFilterValues() {
        this.prtnrCheckBox = this.el.querySelector('#prtnrCheckBox').value;
        this.insType = this.el.querySelector('.type-institute-toggle').value;
        this.oneMillionCheckBox = this.el.querySelector('#one_millionCheckBox').value;
        this.testmonalCheckBox = this.el.querySelector('#testimonialCheckBox').value;
    }
    getFilterValues() {
        let fltString = '';

        if (this.prtnrCheckBox === 'true') {
            fltString += '&key_institutional_partner=TRUE';
        }
        if (this.insType !== '') {
            fltString += `&type=${this.el.querySelector('.type-institute-toggle').value}`;
        }
        if (this.oneMillionCheckBox === 'true') {
            fltString += '&achieving_the_dream_school=TRUE';
        }
        if (this.testmonalCheckBox === 'true') {
            fltString += '&testimonial=TRUE';
        }
        return fltString;
    }
    enableDisableFltr(value) {
        const applyFilterBtn = this.el.querySelector('.applyfltrbtn');

        if (value > 3) {
            applyFilterBtn.classList.add('apply-flt-enabled');
            applyFilterBtn.classList.remove('apply-flt-disabled');
        } else {
            applyFilterBtn.classList.remove('apply-flt-enabled');
            applyFilterBtn.classList.add('apply-flt-disabled');
        }
    }
    filterMapLayer(data) {
        let setSegments;

        if (data === 'clear') {
            setSegments = null;
        } else {
            setSegments = ['in', 'id'].concat(data.map((feature) => {
                return feature.pk;
            }));
        }
        this.mapObject.setFilter('os-schools', setSegments);
        this.mapObject.setFilter('os-schools-shadow-at-8', setSegments);
        this.mapObject.setFilter('os-schools-heat-map', setSegments);
    }
    validateMob() {
        if ($.isMobileDisplay()) {
            const styl = 'border: 0.1rem solid #d5d5d5; border-radius: 0.2rem; margin-right: 0.7rem;';

            this.el.querySelector('.srch').setAttribute('style', styl);
            this.el.querySelector('.searchimg').setAttribute('style', 'display: none');
        }
    }
    markerClickMOb(modelObj, data, glbalObj) {
        if (!$.isMobileDisplay()) {
            this.el.querySelector('.dropDownList').classList.add('single-item-info');
            glbalObj.regions.dataList.attach(new SchoolinfoHead(modelObj));
            glbalObj.regions.dataList.append(new Schoolinfo(modelObj));
            glbalObj.regions.dataList.append(new Testimonialinfo(modelObj));
        } else {
            const dropDownObj= new Dropdown('single_value');
            const unqClassDetailMob = '.detail-info-mob';
            const unqClassTestMob = '.testimonial-body-mob';
            const Region = dropDownObj.regions.self.constructor;
            const regionDetailInfoMob = new Region(unqClassDetailMob, dropDownObj);
            const regionTestimonialMob = new Region(unqClassTestMob, dropDownObj);

            this.showDetailMob(dropDownObj);
            glbalObj.regions.dataList.attach(dropDownObj);
            regionDetailInfoMob.attach(new SchoolinfoHead(modelObj));
            regionDetailInfoMob.append(new Schoolinfo(Object.assign(modelObj, {iObj: 'single_value'})));
            regionTestimonialMob.attach(new Testimonialinfo(modelObj));
        }
    }
    makeFitBoundsArray(dataArray) {
        const latlngArray = dataArray.map((e) => {
            return [Number.parseFloat(e.fields.lat), Number.parseFloat(e.fields.long)];
        });

        const bounds = latlngArray.reduce((bound, coord) => {
            return bound.extend(coord);
        }, new mapboxgl.LngLatBounds(latlngArray[0], latlngArray[0]));

        const setBound = [[bounds._sw.lng, bounds._sw.lat], [bounds._ne.lng, bounds._ne.lat]];

        this.mapObject.fitBounds(setBound, {
            padding: 20
        });
    }

}
