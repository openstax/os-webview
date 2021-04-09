import React, {useState, useEffect} from 'react';
import {useToggle} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons';
import shellBus from '~/components/shell/shell-bus';
import $ from '~/helpers/$';
import cn from 'classnames';
import analytics from '~/helpers/analytics';
import {queryById} from '~/models/querySchools';
import Map from '~/helpers/map-api';
import SearchBox from './search-box/search-box';
import './separatemap.scss';

function useMap() {
    const [map, setMap] = useState();
    const [selectedSchool, setSelectedSchool] = useState();

    useEffect(() => {
        const mapZoom = $.isMobileDisplay() ? 2 : 3;

        setMap(new Map({
            container: 'mapd',
            center: [-95.712891, 37.090240],
            zoom: mapZoom,
            pitchWithRotate: false,
            dragRotate: false,
            touchZoomRotate: false,
            interactive: true
        }));
    }, []);

    useEffect(() => {
        if (map) {
            const container = document.getElementById('mapd');

            container.addEventListener('click', (event) => {
                const delegateTarget = event.target.closest('.mapboxgl-popup-content .put-away');

                if (delegateTarget) {
                    map.tooltip.remove();
                }
            });
            map.on('select-school', (id) => {
                queryById(id).then((schoolInfo) => {
                    setSelectedSchool(schoolInfo);
                });
            });
        }
    }, [map]);

    return [map, selectedSchool];
}

function GoBackControl() {
    return (
        <a
            href="/global-reach" className="back-impact-div"
            onClick={() => analytics.sendPageEvent('map', 'close', '')}
        >
            <span className="close-map-msg">Close map</span>
            <div className="back-impact-btn">
                <FontAwesomeIcon icon={faTimes} className="left-arrow-bak" />
            </div>
        </a>
    );
}

function SearchBoxDiv() {
    const [minimized, toggle] = useToggle(false);
    const [map, selectedSchool] = useMap();

    return (
        <div className={cn('search-box-region', {minimized})}>
            <SearchBox
                map={map} minimized={minimized} toggle={toggle}
                selectedSchool={selectedSchool}
            />
        </div>
    );
}

function PopupMessage() {
    const [popupVisible, togglePopup] = useToggle(true);

    function sendAdoptionEvent() {
        analytics.sendPage('map', 'adoption', '');
    }

    return popupVisible && (
        <div className="popup-msg-div">
            <div className="popup-msg-cross">
                <FontAwesomeIcon
                    icon={faTimes} className="popup-msg-cross-icon"
                    role="button" tabIndex="0"
                    onClick={() => togglePopup()}
                />
            </div>
            <div>Not seeing your school? Numbers aren&apos;t right?</div>
            <div className="popup-msg-link" onClick={sendAdoptionEvent}>
                <a href="https://openstax.org/adoption">Let us know.</a>
            </div>
            <div>
                Since our books are free, we rely on instructors to
                tell us they’re using our books.
            </div>
        </div>
    );
}

export default function SeparateMap() {
    useEffect(() => {
        shellBus.emit('with-sticky');

        return () => shellBus.emit('no-sticky');
    }, []);

    return (
        <main id="maincontent" className="separatemap page">
            <div id="mapd" className="mapd" />
            <GoBackControl />
            <SearchBoxDiv />
            <PopupMessage />
        </main>
    );
}
