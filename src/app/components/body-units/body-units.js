import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import Quote from '~/components/quote/quote.jsx';
import {Document as PDF, Page} from 'react-pdf/dist/esm/entry.webpack5';
import {FrameChanger} from '~/components/carousel/carousel';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faMaximize} from '@fortawesome/free-solid-svg-icons/faMaximize';
import {faDownload} from '@fortawesome/free-solid-svg-icons/faDownload';
import cn from 'classnames';
import './body-units.scss';

function Paragraph({data}) {
    return (
        <RawHTML html={data} />
    );
}

function AlignedImage({data}) {
    const {
        caption,
        image: {original: {src, alt}}
    } = data;

    return (
        <figure className={data.alignment}>
            <img src={src} alt={alt} />
            <RawHTML Tag="figcaption" html={caption} />
        </figure>
    );
}

function PullQuote({data}) {
    const model = {
        image: {},
        content: data.quote,
        attribution: data.attribution
    };

    return (
        <Quote model={model} />
    );
}

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

function Document({data}) {
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

    React.useLayoutEffect(
        () => {
            // FOR LOCAL TESTING because otherwise there is a CORS error
            if (process.env.API_ORIGIN) {
                console.info('*** USING TESTING PDF ***');
                data.download_url = 'https://assets.openstax.org/oscms-dev/media/documents/STUDENT_HS_Physics_Lab_Manual_Full_1.pdf';
            }
        },
        [data]
    );

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

// Using CMS tags, which are not camel-case
/* eslint camelcase: 0 */
const bodyUnits = {
    paragraph: Paragraph,
    aligned_image: AlignedImage,
    pullquote: PullQuote,
    document: Document
};

export default function BodyUnit({unit}) {
    const Unit = bodyUnits[unit.type] || Paragraph;

    return (
        <Unit data={unit.value} />
    );
}
