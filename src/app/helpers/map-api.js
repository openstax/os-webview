import mapboxgl from 'mapbox-gl';
import mix from '~/helpers/controller/mixins';
import busMixin from '~/helpers/controller/bus-mixin';
import settings from 'settings';
import mapboxPromise from '~/models/mapbox';

mapboxgl.accessToken = settings.mapboxPK;

function resizeOnLoad(map) {
    map.on('load', () => {
        if (map.loaded()) {
            map.resize();
        }
    });
}

function setupInteractive(map) {
    resizeOnLoad(map);
    map.on('mouseenter', 'os-schools', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'os-schools', () => {
        map.getCanvas().style.cursor = '';
    });
    map.on('click', 'os-schools', (el) => {
        this.emit('select-school', el.features[0].properties.id);
    });
    map.on('click', (el) => {
        if (!el.features && this.tooltip) {
            this.tooltip.remove();
        }
    });
    return map;
}

function setupStatic(map) {
    resizeOnLoad(map);
    map.scrollZoom.disable();
    map.dragPan.disable();
    map.doubleClickZoom.disable();
    return map;
}

function hasLngLat({lngLat}) {
    return Boolean(lngLat);
}

async function createMap(mapOptions) {
    const mapbox = await mapboxPromise;

    return new mapboxgl.Map(Object.assign({
        style: mapbox.style
    }, mapOptions));
}

class BaseClass {

    constructor(options) {
        const interactive = delete options.interactive;

        this.loaded = createMap(options).then(
            interactive ? setupInteractive.bind(this) : setupStatic
        );
        this.initialState = {
            center: options.center,
            zoom: options.zoom
        };
        this.tooltip = new mapboxgl.Popup({
            closeButton: false,
            closeOnClick: false
        });
    }

    setFilters(filterSpec) {
        this.loaded.then((map) => {
            map.setFilter('os-schools', filterSpec);
            map.setFilter('os-schools-shadow-at-8', filterSpec);
            map.setFilter('os-schools-heat-map', filterSpec);
        });
    }

    setBounds(bounds) {
        this.loaded.then((map) => {
            if (bounds) {
                map.fitBounds(bounds, {
                    padding: 100,
                    maxZoom: 14
                });
            } else {
                map.easeTo(this.initialState);
            }
        });
    }

    showPoints(pointList) {
        const mappable = ({lngLat: [lng, lat]}) => !(lng === 0 && lat === 0);
        const mappableData = pointList.filter(hasLngLat).filter(mappable);

        this.tooltip.remove();
        if (mappableData.length === 0) {
            this.reset();
        } else {
            const bounds = mappableData.reduce(
                (bound, obj) => bound.extend(obj.lngLat),
                new mapboxgl.LngLatBounds()
            );
            const filterSpec = ['in', 'id', ...(mappableData.map((obj) => obj.pk))];

            this.setFilters(filterSpec);
            this.setBounds(bounds);
        }
    }

    reset() {
        this.setFilters();
        this.setBounds();
        this.tooltip.remove();
    }

    showTooltip(schoolInfo, flyThere) {
        if (!hasLngLat(schoolInfo)) {
            return;
        }
        let html = `<b>${schoolInfo.fields.name}</b>`;

        if (schoolInfo.cityState) {
            html += `<br>${schoolInfo.cityState}`;
        }
        this.tooltip.setLngLat(schoolInfo.lngLat);
        this.tooltip.setHTML(html);
        this.loaded.then((map) => {
            this.tooltip.addTo(map);
        });
        if (flyThere) {
            this.setBounds((new mapboxgl.LngLatBounds()).extend(schoolInfo.lngLat));
        }
    }

}

export default mix(BaseClass).with(busMixin);
