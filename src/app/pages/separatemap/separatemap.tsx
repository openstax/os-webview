import React from 'react';
import {useToggle} from '~/helpers/data';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faTimes} from '@fortawesome/free-solid-svg-icons/faTimes';
import {useMainModal} from '~/helpers/main-class-hooks';
import useDocumentHead from '~/helpers/use-document-head';
import cn from 'classnames';
import SearchBox from './search-box/search-box';
import {MapContextProvider} from './map-context';
import './separatemap.scss';

function GoBackControl() {
    return (
        <a href="/global-reach" className="back-impact-div">
            <span className="close-map-msg">Close map</span>
            <div className="back-impact-btn">
                <FontAwesomeIcon icon={faTimes} className="left-arrow-bak" />
            </div>
        </a>
    );
}

function SearchBoxDiv() {
    const [minimized, toggle] = useToggle(false);

    return (
        <div className={cn('search-box-region', {minimized})}>
            <SearchBox minimized={minimized} toggle={toggle} />
        </div>
    );
}

function PopupMessage() {
    const [popupVisible, togglePopup] = useToggle(true);

    return (
        popupVisible && (
            <div className="popup-msg-div">
                <div className="popup-msg-cross">
                    <FontAwesomeIcon
                        icon={faTimes}
                        className="popup-msg-cross-icon"
                        role="button"
                        tabIndex={0}
                        aria-hidden={false}
                        aria-label="close popup"
                        onClick={() => togglePopup()}
                    />
                </div>
                <div>Not seeing your school? Numbers aren&apos;t right?</div>
                <div className="popup-msg-link">
                    <a href="https://openstax.org/adoption">Let us know.</a>
                </div>
                <div>
                    Since our books are free, we rely on instructors to tell us
                    they’re using our books.
                </div>
            </div>
        )
    );
}

export default function SeparateMap() {
    useMainModal();
    useDocumentHead({
        title: 'Institution Map - OpenStax',
        description:
            'Searchable map of institutions that have adopted OpenStax textbooks'
    });

    return (
        <main id="maincontent" className="separatemap page">
            <MapContextProvider contextValueParameters={{id: 'mapd'}}>
                <div id="mapd" className="mapd" />
                <GoBackControl />
                <SearchBoxDiv />
                <PopupMessage />
            </MapContextProvider>
        </main>
    );
}
