import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import Map from './map-api';
import {isMobileDisplay} from '~/helpers/device';
import {queryById} from '~/models/query-schools';

function useMap(id) {
    const mapZoom = isMobileDisplay() ? 2 : 3;
    const map = React.useMemo(
        () => new Map({
            container: id,
            center: [-95.712891, 37.090240],
            zoom: mapZoom,
            pitchWithRotate: false,
            dragRotate: false,
            touchZoomRotate: false
        }),
        [mapZoom, id]
    );

    React.useEffect(() => {
        const container = document.getElementById('mapd');
        const clickHandler = (event) => {
            const delegateTarget = event.target.closest('.mapboxgl-popup-content .put-away');

            if (delegateTarget) {
                map.tooltip.remove();
            }
        };

        container.addEventListener('click', clickHandler);
        return () => container.removeEventListener('click', clickHandler);
    }, [map]);

    return map;
}

function useSelectedSchool(map) {
    const [selectedSchool, setSelectedSchool] = React.useState();
    const selectSchool = React.useCallback(
        (id) => queryById(id).then(
            (schoolInfo) => setSelectedSchool(schoolInfo)
        ),
        []
    );

    React.useEffect(
        () => map.loaded.then((glMap) => {
            glMap.on(
                'click',
                'os-schools',
                (el) => selectSchool(el.features[0].properties.id)
            );
        }),
        [map.loaded, selectSchool]
    );

    return selectedSchool;
}

function useContextValue({id}) {
    const map = useMap(id);
    const selectedSchool = useSelectedSchool(map);

    return {
        map,
        selectedSchool
    };
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {
    useContext as default,
    ContextProvider as MapContextProvider
};
