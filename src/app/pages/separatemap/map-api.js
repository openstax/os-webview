import mapboxgl from 'mapbox-gl';
import mapboxPromise from '~/models/mapbox';
// import useMapContext from './map-context';

const settings = window.SETTINGS;

// Set up CSS once, when needed
(() => {
    const cssEl = Object.assign(
        document.createElement('link'),
        {
            rel: 'stylesheet',
            href: 'https://api.tiles.mapbox.com/mapbox-gl-js/v0.47.0/mapbox-gl.css',
            type: 'text/css'
        }
    );
    const firstLink = document.querySelector('head link[rel="stylesheet"]') ||
        document.querySelector('head title');

    firstLink.parentNode.insertBefore(cssEl, firstLink.nextSibling);
})();

mapboxgl.accessToken = settings.mapboxPK;

function resizeOnLoad(map) {
    map.on('load', () => map.loaded() && map.resize());
}

// map is the MapboxGL map object; this is my new object
function setupInteractive(map) {
    resizeOnLoad(map);
    map.on('mouseenter', 'os-schools', () => {
        map.getCanvas().style.cursor = 'pointer';
    });
    map.on('mouseleave', 'os-schools', () => {
        map.getCanvas().style.cursor = '';
    });
    map.on('click', (el) => {
        if (!el.features && this.tooltip) {
            this.tooltip.remove();
        }
    });
    return map;
}

function hasLngLat({lngLat}) {
    return Boolean(lngLat);
}

async function createMap(mapOptions) {
    const mapbox = await mapboxPromise;

    return new mapboxgl.Map({
        style: mapbox.style,
        ...mapOptions
    });
}

class BaseClass {

    constructor(options) {
        // This is a promise that yields the MapboxGL map object
        this.loaded = createMap(options).then(
            setupInteractive.bind(this)
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
        let html = `
        <div class="put-away">
            <button type="button">
                &times;
            </button>
        </div>
        <b>${schoolInfo.fields.name}</b>
        `;

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

export default BaseClass;
