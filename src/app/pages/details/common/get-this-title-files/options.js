import React, {useState, useLayoutEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import $ from '~/helpers/$';
import OrderPrintCopy from './order-print-copy/order-print-copy';
import StudyEdge from './study-edge/study-edge';
import showDialog, {hideDialog} from '../show-dialog';
import RecommendedCallout from './recommended-callout/recommended-callout';
import calloutCounter from './recommended-callout/callout-counter';

function IconAndText({icon, text}) {
    return (
        <React.Fragment>
            <FontAwesomeIcon icon={icon} />
            <span className="text">{text}</span>
        </React.Fragment>
    );
}

function Option({condition, children}) {
    if (!condition) {
        return null;
    }

    return (
        <div className="option" children={children} />
    );
}

export function SimpleLinkOption({link, icon, text, ...linkOptions}) {
    return (
        <Option condition={link}>
            <a
                href={link}
                {...linkOptions}
            >
                <IconAndText icon={icon} text={text} />
            </a>
        </Option>
    );
}

export function TocOption({model, tocState={}}) {
    const includeTOC = ['live', 'new_edition_available'].includes(model.bookState);
    const text = $.isPolish(model.title) ? 'Spis treści' : 'Table of contents';

    if (!includeTOC) {
        return null;
    }

    function toggleToc(event) {
        tocState.toggle();
        event.preventDefault();
    }

    return (
        <div className="option toc-option">
            <a
                href="/" role="button" className="show-toc"
                aria-pressed={tocState.isOpen}
                onClick={toggleToc}
                onKeyDown={$.treatSpaceOrEnterAsClick}
            >
                <FontAwesomeIcon icon="list-ol" />
                <span className="text">{text}</span>
            </a>
        </div>
    );
}

const MAX_CALLOUTS = 3;

function useCalloutCounter(slug) {
    calloutCounter.setSlug(slug);
    const [count, setCount] = useState(calloutCounter.count);

    useLayoutEffect(() => {
        if (count < MAX_CALLOUTS) {
            calloutCounter.increment();
            setCount(calloutCounter.count);
        }
    }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

    function hideForever() {
        calloutCounter.count = MAX_CALLOUTS;
        setCount(MAX_CALLOUTS);
    }

    return [count < MAX_CALLOUTS, hideForever];
}

// eslint-disable-next-line complexity
export function WebviewOption({model}) {
    const [showCallout, hideForever] = useCalloutCounter(model.slug);
    const isTutor = model.webviewRexLink.includes('tutor');
    const isRex = !isTutor && Boolean(model.webviewRexLink);
    const webviewLink = model.webviewRexLink || model.webviewLink;
    const iconAndTextArgs = isTutor ? {
        icon: 'atom',
        text: 'Go to OpenStax Tutor'
    } : {
        icon: 'laptop',
        text: $.isPolish(model.title) ? 'Zobacz w przeglądarce' : 'View online'
    };

    return (
        <Option condition={!model.comingSoon && webviewLink}>
            <div className="option-with-callout">
                <a
                    href={webviewLink} data-local={isRex} data-track="Online"
                    _target={isTutor ? '_blank' : ''}
                >
                    <IconAndText {...iconAndTextArgs} />
                </a>
                {
                    showCallout &&
                        <div className="callout recommended-callout">
                            <RecommendedCallout
                                title={model.rexCalloutTitle}
                                blurb={model.rexCalloutBlurb}
                                onPutAway={hideForever}
                            />
                        </div>
                }
            </div>
        </Option>
    );
}

export function StudyEdgeOption({model}) {
    return (
        <SimpleLinkOption
            link={model.enableStudyEdge} icon="mobile-alt" text="Download the app"
            onClick={(event) => showDialog({
                event,
                dialogContent: StudyEdge,
                dialogContentArgs: {model},
                dialogArgs: {customClass: 'wider-dialog'}
            })}
        />
    );
}

export function PdfOption({model}) {
    const polish = $.isPolish(model.title);
    const pdfText = polish ? ' Pobierz PDF' : ' Download a PDF';
    const sampleText = polish ? ' przykład' : ' sample';
    const text = pdfText + (model.comingSoon ? sampleText : '');
    const pdfLink = (model.highResolutionPdfUrl || model.lowResolutionPdfUrl);

    return (
        <SimpleLinkOption
            link={pdfLink} icon="cloud-download-alt" text={text}
            data-track="PDF"
        />
    );
}

export function PrintOption({model}) {
    const printLink = Boolean(
        model.amazonLink || [].concat(model.bookstoreContent).filter((c) => c.buttonUrl).length
    );
    const dialogContentArgs = {
        bookstoreContent: model.bookstoreContent,
        amazonLink: model.amazonLink,
        closeAfterDelay(event) {
            if (event) {
                window.requestAnimationFrame(hideDialog);
            }
        }
    };
    const text = $.isPolish(model.title) ? 'Zamów egzemplarz drukowany' : 'Order a print copy';

    return (
        <SimpleLinkOption
            link={printLink} icon="book" text={text}
            onClick={(event) => showDialog({
                event,
                dialogTitle: text,
                dialogContent: OrderPrintCopy,
                dialogContentArgs
            })}
        />
    );
}

export function BookshareOption({model}) {
    return (
        <SimpleLinkOption
            link={model.bookshareLink} icon="volume-up" text="Bookshare"
            data-track="Bookshare"
        />
    );
}

export function Ibooks2Volumes({model}) {
    return (
        <React.Fragment>
            <span className="option-header">
                <IconAndText icon={['fab', 'apple']} text="Download on iBooks" />
            </span>
            <a
                href={model.ibookLink} data-track="iBooks"
            >
                Part 1
            </a>
            <a
                href={model.ibookLink2} data-track="iBooks"
            >
                Part 2
            </a>
        </React.Fragment>
    );
}

export function IbooksOption({model}) {
    return (
        <Option condition={model.ibookLink}>
            {
                model.ibookLink2 ?
                    <Ibooks2Volumes model={model} /> :
                    <a href={model.ibookLink} data-track="iBooks">
                        <IconAndText icon={['fab', 'apple']} text="Download on iBooks" />
                    </a>

            }
        </Option>
    );
}

export function KindleOption({model}) {
    return (
        <SimpleLinkOption
            link={model.kindleLink} icon={['fab', 'amazon']} text="Download for Kindle"
            data-track="Kindle"
        />
    );
}

export function CheggOption({model}) {
    return (
        <Option condition={model.cheggLink}>
            <a
                href={model.cheggLink} data-track="Chegg Reader"
            >
                <img className="logo-img" src="/images/icons/Chegglogo.svg" alt="" />
                <span className="text">
                    {model.cheggLinkText}
                </span>
            </a>
        </Option>
    );
}

export function OptionExpander({expanded, additionalOptions, toggle}) {
    if (additionalOptions < 1) {
        return null;
    }
    const s = additionalOptions > 1 ? 's' : '';
    const text = expanded ?
        `See ${additionalOptions} fewer options` :
        `+ ${additionalOptions} more option${s}...`;

    function onClick(event) {
        toggle();
        event.preventDefault();
    }

    return (
        <div className="option expander">
            <a
                href="."
                onClick={onClick} onKeyDown={$.treatSpaceOrEnterAsClick}
                aria-expanded={expanded}
            >
                {text}
            </a>
        </div>
    );
}
