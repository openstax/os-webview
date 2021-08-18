import React, {useState, useLayoutEffect} from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faAtom} from '@fortawesome/free-solid-svg-icons/faAtom';
import {faBook} from '@fortawesome/free-solid-svg-icons/faBook';
import {faLaptop} from '@fortawesome/free-solid-svg-icons/faLaptop';
import {faListOl} from '@fortawesome/free-solid-svg-icons/faListOl';
import {faMobileAlt} from '@fortawesome/free-solid-svg-icons/faMobileAlt';
import {faCloudDownloadAlt} from '@fortawesome/free-solid-svg-icons/faCloudDownloadAlt';
import {faVolumeUp} from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import {faAmazon} from '@fortawesome/free-brands-svg-icons/faAmazon';
import {faApple} from '@fortawesome/free-brands-svg-icons/faApple';
import $ from '~/helpers/$';
import OrderPrintCopy from './order-print-copy/order-print-copy';
import useLanguageContext from '~/contexts/language';
import useAmazonAssociatesLink from './amazon-associates-link';
import StudyEdge from './study-edge/study-edge';
import useTOCContext from '../toc-slideout/context';
import {useDialog} from '~/components/dialog/dialog';
import RecommendedCallout from './recommended-callout/recommended-callout';
import useGiveDialog from './give-before-pdf/give-before-pdf';
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

export function SimpleLinkOption({link, icon, text, children, ...linkOptions}) {
    return (
        <Option condition={link}>
            <a
                href={link}
                {...linkOptions}
            >
                <IconAndText icon={icon} text={text} />
            </a>
            {children}
        </Option>
    );
}

const localizedTexts = {
    en: {
        toc: 'Table of contents',
        webview: {
            link: 'View online',
            tutor: 'Go to OpenStax Tutor'
        },
        app: 'Download the app',
        pdf: {
            download: ' Download a PDF',
            sample: ' sample'
        },
        print: 'Order a print copy',
        ibooks: {
            download: 'Download on iBooks',
            part: 'Part'
        },
        kindle: {
            header: 'Download for Kindle',
            disclaimer: 'As an Amazon Associate we earn from qualifying purchases'
        }
    },
    es: {
        toc: 'Tabla de contenido',
        webview: {
            link: 'Ver en línea',
            tutor: 'Ir al OpenStax Tutor'
        },
        app: 'Descargar la aplicación',
        pdf: {
            download: ' Descargar un PDF',
            sample: ' muestra'
        },
        print: 'Solicitar una copia impresa',
        ibooks: {
            download: 'Descargar en iBooks',
            part: 'Parte'
        },
        kindle: {
            header: 'Descargar para Kindle',
            disclaimer: 'Como Asociado de Amazon, ganamos con las compras que califican'
        }
    }
};

export function TocOption({model}) {
    const {toggle, isOpen} = useTOCContext();
    const includeTOC = ['live', 'new_edition_available'].includes(model.bookState);
    const {language} = useLanguageContext();
    const text = $.isPolish(model.title) ? 'Spis treści' : localizedTexts[language].toc;

    if (!includeTOC) {
        return null;
    }

    function toggleToc(event) {
        toggle();
        event.preventDefault();
    }

    return (
        <div className="option toc-option">
            <a
                href="/" role="button" className="show-toc"
                aria-pressed={isOpen}
                onClick={toggleToc}
                onKeyDown={$.treatSpaceOrEnterAsClick}
            >
                <FontAwesomeIcon icon={faListOl} />
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
    const {language} = useLanguageContext();
    const texts = localizedTexts[language].webview;
    const isTutor = model.webviewRexLink.includes('tutor');
    const isRex = !isTutor && Boolean(model.webviewRexLink);
    const webviewLink = model.webviewRexLink || model.webviewLink;
    const iconAndTextArgs = isTutor ? {
        icon: faAtom,
        text: texts.tutor
    } : {
        icon: faLaptop,
        text: $.isPolish(model.title) ? 'Zobacz w przeglądarce' : texts.link
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
    const [Dialog, open] = useDialog();
    const {language} = useLanguageContext();
    const text = localizedTexts[language].app;

    function onClick(event) {
        event.preventDefault();
        open();
    }

    return (
        <SimpleLinkOption
            link={model.enableStudyEdge} icon={faMobileAlt} text={text}
            onClick={onClick}
        >
            <Dialog className="wider-dialog">
                <StudyEdge model={model} />
            </Dialog>
        </SimpleLinkOption>
    );
}

export function PdfOption({model}) {
    const polish = $.isPolish(model.title);
    const {language} = useLanguageContext();
    const texts = localizedTexts[language].pdf;
    const pdfText = polish ? ' Pobierz PDF' : texts.download;
    const sampleText = polish ? ' przykład' : texts.sample;
    const text = pdfText + (model.comingSoon ? sampleText : '');
    const pdfLink = (model.highResolutionPdfUrl || model.lowResolutionPdfUrl);
    const {GiveDialog, open, enabled} = useGiveDialog();

    function onClick(event) {
        if (enabled && !$.isMobileDisplay()) {
            event.preventDefault();
            open();
        }
    }

    return (
        <React.Fragment>
            <SimpleLinkOption
                link={pdfLink} icon={faCloudDownloadAlt} text={text}
                data-track="PDF"
                onClick={onClick}
            />
            <GiveDialog link={pdfLink} />
        </React.Fragment>
    );
}

function isRealPrintLink(url) {
    return typeof url === 'string' && !url.includes('stores/page');
}

export function PrintOption({model}) {
    const slug = (model.slug || '').replace('books/', '');
    const amazonDataLink = useAmazonAssociatesLink(slug);
    const {language} = useLanguageContext();
    const printText = localizedTexts[language].print;
    const text = $.isPolish(model.title) ? 'Zamów egzemplarz drukowany' : printText;
    const [Dialog, open, close] = useDialog();

    function onClick(event) {
        event.preventDefault();
        open();
    }

    return (
        <SimpleLinkOption
            link={isRealPrintLink(amazonDataLink.url)} icon={faBook} text={text}
            onClick={onClick}
        >
            <Dialog title={text} >
                <OrderPrintCopy amazonDataLink={amazonDataLink} hideDialog={() => close()} />
            </Dialog>
        </SimpleLinkOption>
    );
}

export function BookshareOption({model}) {
    return (
        <SimpleLinkOption
            link={model.bookshareLink} icon={faVolumeUp} text="Bookshare"
            data-track="Bookshare"
        />
    );
}

export function Ibooks2Volumes({model}) {
    const {language} = useLanguageContext();
    const texts = localizedTexts[language].ibooks;

    return (
        <React.Fragment>
            <span className="option-header">
                <IconAndText icon={faApple} text={texts.download} />
            </span>
            <a href={model.ibookLink} data-track="iBooks">
                {`${texts.part} 1`}
            </a>
            <a href={model.ibookLink2} data-track="iBooks">
                {`${texts.part} 2`}
            </a>
        </React.Fragment>
    );
}

export function IbooksOption({model}) {
    const {language} = useLanguageContext();
    const texts = localizedTexts[language].ibooks;

    return (
        <Option condition={model.ibookLink}>
            {
                model.ibookLink2 ?
                    <Ibooks2Volumes model={model} /> :
                    <a href={model.ibookLink} data-track="iBooks">
                        <IconAndText icon={faApple} text={texts.download} />
                    </a>

            }
        </Option>
    );
}

export function KindleOption({model}) {
    const {language} = useLanguageContext();
    const texts = localizedTexts[language].kindle;

    return (
        <SimpleLinkOption
            link={model.kindleLink} icon={faAmazon} text={texts.header}
            data-track="Kindle"
        >
            <div className="disclaimer">{texts.disclaimer}</div>
        </SimpleLinkOption>
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
