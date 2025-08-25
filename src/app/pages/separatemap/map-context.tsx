import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import createMap from './map-api';
import {isMobileDisplay} from '~/helpers/device';
import {AugmentedInfo, queryById} from '~/models/query-schools';
import {assertNotNull} from '~/helpers/data';

function useMap(id: string) {
    const mapZoom = isMobileDisplay() ? 2 : 3;
    const map = React.useMemo(
        () => createMap({
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
        const container = assertNotNull(document.getElementById('mapd'));
        const clickHandler = (event: MouseEvent) => {
            const delegateTarget = (event.target as Element).closest('.mapboxgl-popup-content .put-away');

            if (delegateTarget) {
                map.tooltip.remove();
            }
        };

        container.addEventListener('click', clickHandler);
        return () => container.removeEventListener('click', clickHandler);
    }, [map]);

    return map;
}

type Map = ReturnType<typeof createMap>;

function useSelectedSchool(map: Map) {
    const [selectedSchool, setSelectedSchool] = React.useState<AugmentedInfo | null>(null);
    const selectSchool = React.useCallback(
        (id: string) => queryById(id).then(
            (schoolInfo) => setSelectedSchool(schoolInfo)
        ),
        []
    );

    React.useEffect(
        () => {
            map.loaded.then((glMap) => {
                glMap.on(
                    'click',
                    'os-schools',
                    (el) => selectSchool(el.features?.[0].properties?.id)
                );
            });
        },
        [map.loaded, selectSchool]
    );

    return selectedSchool;
}

function useContextValue({id}: {id: string}) {
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
