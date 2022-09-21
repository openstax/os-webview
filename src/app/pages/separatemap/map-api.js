import mapboxgl from 'mapbox-gl';
import mapboxPromise from '~/models/mapbox';

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

    firstLink?.parentNode.insertBefore(cssEl, firstLink.nextSibling);
})();

mapboxgl.accessToken = settings.mapboxPK;

function hasLngLat({lngLat}) {
    return Boolean(lngLat);
}

async function createMapboxMap(mapOptions) {
    const mapbox = await mapboxPromise;

    return new mapboxgl.Map({
        style: mapbox.style,
        ...mapOptions
    });
}

export default function createMap(options) {
    // This is a promise that yields the MapboxGL map object
    const loaded = createMapboxMap(options);
    const initialState = {
        center: options.center,
        zoom: options.zoom
    };

    function setBounds(bounds) {
        loaded.then((map) => {
            if (bounds) {
                map.fitBounds(bounds, {
                    padding: 100,
                    maxZoom: 14
                });
            } else {
                map.easeTo(initialState);
            }
        });
    }

    function setFilters(filterSpec) {
        loaded.then((map) => {
            map.setFilter('os-schools', filterSpec);
            map.setFilter('os-schools-shadow-at-8', filterSpec);
            map.setFilter('os-schools-heat-map', filterSpec);
        });
    }

    const tooltip = new mapboxgl.Popup({
        closeButton: false,
        closeOnClick: false
    });

    function reset() {
        setFilters();
        setBounds();
        tooltip.remove();
    }

    function showPoints(pointList) {
        const mappable = ({lngLat: [lng, lat]}) => !(lng === 0 && lat === 0);
        const mappableData = pointList.filter(hasLngLat).filter(mappable);

        tooltip.remove();
        if (mappableData.length === 0) {
            reset();
        } else {
            const bounds = mappableData.reduce(
                (bound, obj) => bound.extend(obj.lngLat),
                new mapboxgl.LngLatBounds()
            );
            const filterSpec = ['in', 'id', ...(mappableData.map((obj) => obj.pk))];

            setFilters(filterSpec);
            setBounds(bounds);
        }
    }

    function showTooltip(schoolInfo, flyThere) {
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
        tooltip.setLngLat(schoolInfo.lngLat);
        tooltip.setHTML(html);
        loaded.then((map) => {
            tooltip.addTo(map);
        });
        if (flyThere) {
            setBounds((new mapboxgl.LngLatBounds()).extend(schoolInfo.lngLat));
        }
    }

    loaded.then(
        (map) => {
            map.on('load', () => map.loaded() && map.resize());
            map.on('mouseenter', 'os-schools', () => {
                map.getCanvas().style.cursor = 'pointer';
            });
            map.on('mouseleave', 'os-schools', () => {
                map.getCanvas().style.cursor = '';
            });
            map.on('click', (el) => {
                if (!el.features && tooltip) {
                    tooltip.remove();
                }
            });
        }
    );

    return {
        loaded,
        tooltip,
        showTooltip,
        showPoints
    };
}
