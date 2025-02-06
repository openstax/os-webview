import React from 'react';
import {
    FontAwesomeIcon,
    FontAwesomeIconProps
} from '@fortawesome/react-fontawesome';
import {faLaptop} from '@fortawesome/free-solid-svg-icons/faLaptop';
import {faListOl} from '@fortawesome/free-solid-svg-icons/faListOl';
import {faCloudDownloadAlt} from '@fortawesome/free-solid-svg-icons/faCloudDownloadAlt';
import {faVolumeUp} from '@fortawesome/free-solid-svg-icons/faVolumeUp';
import {faAmazon} from '@fortawesome/free-brands-svg-icons/faAmazon';
import {faApple} from '@fortawesome/free-brands-svg-icons/faApple';
import $ from '~/helpers/$';
import {treatSpaceOrEnterAsClick} from '~/helpers/events';
import {useIntl, FormattedMessage} from 'react-intl';
import OrderPrintCopy from './order-print-copy/order-print-copy';
import useTOCContext from '../toc-slideout/context';
import {useDialog} from '~/components/dialog/dialog';
import RecommendedCallout from './recommended-callout/recommended-callout';
import {useOpenGiveDialog} from './give-before-pdf/use-give-dialog';
import useCalloutCounter from './recommended-callout/use-callout-counter';
import trackLink from '../track-link';
import type {Model} from '../get-this-title';
import type {TrackedMouseEvent} from '~/components/shell/router-helpers/use-link-handler';

type Icon = FontAwesomeIconProps['icon'];

function IconAndText({icon, text}: {icon: Icon; text: string}) {
    return (
        <React.Fragment>
            <FontAwesomeIcon icon={icon} />
            <span className="text">{text}</span>
        </React.Fragment>
    );
}

function Option({
    condition,
    children
}: React.PropsWithChildren<{
    condition: string | false;
}>) {
    if (!condition) {
        return null;
    }

    return <div className="option" children={children} />;
}

export function SimpleLinkOption({
    link,
    icon,
    text,
    children,
    ...linkOptions
}: React.PropsWithChildren<
    {
        link: string;
        icon: Icon;
        text: string;
    } & React.AnchorHTMLAttributes<HTMLAnchorElement>
>) {
    return (
        <Option condition={link}>
            <a href={link} {...linkOptions}>
                <IconAndText icon={icon} text={text} />
            </a>
            {children}
        </Option>
    );
}

export function TocOption({model}: {model: Model}) {
    const {toggle, isOpen} = useTOCContext();
    const includeTOC = ['live', 'deprecated', 'new_edition_available'].includes(
        model.bookState
    );
    const intl = useIntl();
    const text = $.isPolish(model.title)
        ? 'Spis treści'
        : intl.formatMessage({id: 'getit.toc'});

    if (!includeTOC) {
        return null;
    }

    function toggleToc(event: React.MouseEvent) {
        toggle();
        event.preventDefault();
    }

    return (
        <div className="option toc-option">
            <a
                href="/"
                role="button"
                className="show-toc"
                aria-pressed={isOpen}
                onClick={toggleToc}
                onKeyDown={treatSpaceOrEnterAsClick}
            >
                <FontAwesomeIcon icon={faListOl} />
                <span className="text">{text}</span>
            </a>
        </div>
    );
}


export function WebviewOption({model}: {model: Model}) {
    const [showCallout, hideForever] = useCalloutCounter(model.slug);

    const intl = useIntl();
    const texts = {
        link: intl.formatMessage({id: 'getit.webview.link'})
    };
    const isRex = Boolean(model.webviewRexLink);
    const webviewLink = model.webviewRexLink || model.webviewLink;
    const iconAndTextArgs = {
        icon: faLaptop,
        text: $.isPolish(model.title) ? 'Zobacz w przeglądarce' : texts.link
    };
    const {GiveDialog, openGiveDialog} = useOpenGiveDialog();
    const trackDownload = React.useCallback(
        (event: TrackedMouseEvent) => {
            trackLink(event, model.id);
        },
        [model.id]
    );

    return (
        <Option condition={!model.comingSoon && webviewLink}>
            <div className="option-with-callout">
                <a
                    href={webviewLink}
                    data-local={isRex}
                    rel="noreferrer"
                    onClick={openGiveDialog}
                >
                    <IconAndText {...iconAndTextArgs} />
                </a>
                <GiveDialog
                    link={webviewLink}
                    variant="View online"
                    warning={model.contentWarningText}
                    track="Online"
                    onDownload={trackDownload as (e: React.MouseEvent) => void}
                    id={model.id}
                />
                {showCallout && (
                    <div className="callout recommended-callout">
                        <RecommendedCallout
                            title={model.rexCalloutTitle}
                            blurb={model.rexCalloutBlurb}
                            onPutAway={hideForever}
                        />
                    </div>
                )}
            </div>
        </Option>
    );
}

export function PdfOption({model}: {model: Model}) {
    const polish = $.isPolish(model.title);
    const intl = useIntl();
    const pdfText = polish
        ? ' Pobierz PDF'
        : intl.formatMessage({id: 'getit.pdf.download'});
    const sampleText = polish
        ? ' przykład'
        : intl.formatMessage({id: 'getit.pdf.sample'});
    const text = pdfText + (model.comingSoon ? sampleText : '');
    const pdfLink = model.highResolutionPdfUrl; // low res option is obsolete now
    const {GiveDialog, openGiveDialog} = useOpenGiveDialog();
    const trackDownload = React.useCallback(
        (event: TrackedMouseEvent) => {
            trackLink(event, model.id);
        },
        [model.id]
    );

    return (
        <React.Fragment>
            <SimpleLinkOption
                link={pdfLink}
                icon={faCloudDownloadAlt}
                text={text}
                onClick={openGiveDialog}
            />
            <GiveDialog
                link={pdfLink}
                track="PDF"
                onDownload={trackDownload as (e: React.MouseEvent) => void}
                id={model.id}
                warning={model.contentWarningText}
            />
        </React.Fragment>
    );
}

export function usePrintCopyDialog() {
    const [Dialog, open] = useDialog();
    const PCDialog = React.useCallback(
        ({text, slug}: {text: string; slug: string}) => (
            <Dialog title={text}>
                <OrderPrintCopy slug={slug} />
            </Dialog>
        ),
        [Dialog]
    );
    const onClick = React.useCallback(
        (event: React.MouseEvent) => {
            event.preventDefault();
            open();
        },
        [open]
    );

    return {onClick, PCDialog};
}

export function BookshareOption({model}: {model: Model}) {
    return (
        <SimpleLinkOption
            link={model.bookshareLink}
            icon={faVolumeUp}
            text="Bookshare"
            data-track="Bookshare"
        />
    );
}

export function Ibooks2Volumes({model}: {model: Model}) {
    const intl = useIntl();
    const download = intl.formatMessage({id: 'getit.ibooks.download'});

    return (
        <React.Fragment>
            <span className="option-header">
                <IconAndText icon={faApple} text={download} />
            </span>
            <a href={model.ibookLink} data-track="iBooks">
                <FormattedMessage
                    id="getit.ibooks.part1"
                    defaultMessage="iBooks part 1"
                />
            </a>
            <a href={model.ibookLink2} data-track="iBooks">
                <FormattedMessage
                    id="getit.ibooks.part2"
                    defaultMessage="iBooks part 2"
                />
            </a>
        </React.Fragment>
    );
}

export function IbooksOption({model}: {model: Model}) {
    const intl = useIntl();
    const download = intl.formatMessage({id: 'getit.ibooks.download'});

    return (
        <Option condition={model.ibookLink}>
            {model.ibookLink2 ? (
                <Ibooks2Volumes model={model} />
            ) : (
                <a href={model.ibookLink} data-track="iBooks">
                    <IconAndText icon={faApple} text={download} />
                </a>
            )}
        </Option>
    );
}

export function KindleOption({model}: {model: Model}) {
    const intl = useIntl();
    const header = intl.formatMessage({id: 'getit.kindle.header'});
    const defaultDisclaimer =
        'As an Amazon Associate we earn from qualifying purchases';

    return (
        <SimpleLinkOption
            link={model.kindleLink}
            icon={faAmazon}
            text={header}
            data-track="Kindle"
        >
            <div className="disclaimer">
                <FormattedMessage
                    id="getit.kindle.disclaimer"
                    defaultMessage={defaultDisclaimer}
                />
            </div>
        </SimpleLinkOption>
    );
}

export function CheggOption({model}: {model: Model}) {
    return (
        <Option condition={model.cheggLink}>
            <a href={model.cheggLink} data-track="Chegg Reader">
                <img
                    className="logo-img"
                    src="/dist/images/icons/Chegglogo.svg"
                    alt=""
                />
                <span className="text">{model.cheggLinkText}</span>
            </a>
        </Option>
    );
}

function useExpanderText(optionCount: number) {
    const intl = useIntl();
    const options =
        optionCount > 1
            ? intl.formatMessage({id: 'options'})
            : intl.formatMessage({id: 'option'});

    return {
        fewer: intl.formatMessage(
            {id: 'expander.fewer'},
            {optionCount, options}
        ),
        more: intl.formatMessage({id: 'expander.more'}, {optionCount, options})
    };
}

export function OptionExpander({
    expanded,
    additionalOptions,
    toggle
}: {
    expanded: boolean;
    toggle: () => void;
    additionalOptions: number;
}) {
    const text =
        useExpanderText(additionalOptions)[expanded ? 'fewer' : 'more'];
    const doToggle = React.useCallback(
        (event: React.MouseEvent) => {
            toggle();
            event.preventDefault();
        },
        [toggle]
    );

    if (additionalOptions < 1) {
        return null;
    }

    return (
        <div className="option expander">
            <a
                href="."
                onClick={doToggle}
                onKeyDown={treatSpaceOrEnterAsClick}
                aria-expanded={expanded}
            >
                {text}
            </a>
        </div>
    );
}
