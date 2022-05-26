import React from 'react';
import {Document as PDF, Page} from 'react-pdf/dist/esm/entry.webpack5';
import {FrameChanger} from '~/components/carousel/carousel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMaximize} from '@fortawesome/free-solid-svg-icons/faMaximize';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import cn from 'classnames';
import './pdf-unit.scss';

function PageControls({pageNumber, setPageNumber, lastPage}) {
    const nextAvailable = React.useMemo(
        () => pageNumber < lastPage,
        [pageNumber, lastPage]
    );
    const prevAvailable = React.useMemo(
        () => pageNumber > 1,
        [pageNumber]
    );
    const nextPage = React.useCallback(
        () => setPageNumber(pageNumber + 1),
        [pageNumber, setPageNumber]
    );
    const prevPage = React.useCallback(
        () => setPageNumber(pageNumber - 1),
        [pageNumber, setPageNumber]
    );

    return (
        <React.Fragment>
            <FrameChanger
                chevronDirection="left"
                onClick={prevPage}
                disable={!prevAvailable}
            />
            <FrameChanger
                chevronDirection="right"
                onClick={nextPage}
                disable={!nextAvailable}
            />
        </React.Fragment>
    );
}

// eslint-disable-next-line complexity
function toggleFullscreen(elem) {
    elem.requestFullscreen = elem.requestFullscreen || elem.mozRequestFullscreen ||
          elem.msRequestFullscreen || elem.webkitRequestFullscreen;

    if (!document.fullscreenElement) {
        elem.requestFullscreen().then({}).catch((err) => {
            // eslint-disable-next-line no-alert
            window.alert(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
        });
    } else if (document.exitFullscreen) {
        document.exitFullscreen();
    }
}

function useIsFullscreen() {
    const [isFullScreen, updateIsFullScreen] = React.useReducer(
        () => document.fullscreenElement,
        document.fullscreenElement
    );

    React.useEffect(
        () => {
            window.addEventListener('fullscreenchange', updateIsFullScreen);

            return () => window.removeEventListener('fullscreenchange', updateIsFullScreen);
        },
        []
    );

    return isFullScreen;
}

export default function Document({data}) {
    const [numPages, setNumPages] = React.useState(null);
    const [pageNumber, setPageNumber] = React.useState(1);
    const ref = React.useRef();
    const goFullScreen = React.useCallback(
        (event) => {
            event.preventDefault();
            toggleFullscreen(ref.current);
        },
        []
    );
    const isFullScreen = useIsFullscreen();
    const pageH = React.useMemo(
        () => isFullScreen ? window.screen.height : null,
        [isFullScreen]
    );

    // FOR LOCAL TESTING because otherwise there is a CORS error
    if (process.env.API_ORIGIN) {
        console.info('*** USING TESTING PDF ***');
        // eslint-disable-next-line camelcase
        data.download_url = 'https://assets.openstax.org/oscms-dev/media/documents/STUDENT_HS_Physics_Lab_Manual_Full_1.pdf';
    }

    return (
        <div
            ref={ref}
            className={cn('pdf-container', {fullscreen: isFullScreen})}
        >
            <PDF
                file={data.download_url}
                onLoadSuccess={({numPages: n}) => setNumPages(n)}
                inputRef={ref}
            >
                <div className="pages-side-by-side">
                    {
                        pageNumber > 1 ?
                            <Page pageNumber={pageNumber - 1} noData="" height={pageH} /> :
                            <div />
                    }
                    <Page pageNumber={pageNumber} height={pageH} />
                </div>
                <div className="control-bar">
                    <a download href={data.download_url}>
                        Download
                        <FontAwesomeIcon icon={faDownload} />
                    </a>
                    <div>{pageNumber} of {numPages}</div>
                    <a href="display:Fullscreen" onClick={goFullScreen}>
                        Full screen
                        <FontAwesomeIcon icon={faMaximize} />
                    </a>
                </div>
                <PageControls
                    pageNumber={pageNumber} setPageNumber={setPageNumber}
                    lastPage={numPages}
                />
            </PDF>
        </div>
    );
}
