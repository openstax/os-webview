import React, {useState, useEffect} from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import fetchRexRelease from '~/models/rex-release';
import {FormattedMessage, useIntl} from 'react-intl';

function PdfUpdateInfo({updateDate, url}) {
    if (!updateDate) {
        return null;
    }

    return (
        <div className="loc-pdf-update-date">
            <div className="callout-container">
                <h4>
                    <FormattedMessage
                        id="pubinfo.pdf.heading"
                        defaultMessage="PDF Version Last Updated:"
                    />
                </h4>
                {formatDate(updateDate)}
                {
                    url &&
                        <div className="callout">
                            <div>
                                <FormattedMessage
                                    id="pubinfo.pdf.see"
                                    defaultMessage="See changes in the"
                                />
                                {' '}
                                <a href={url}>
                                    <FormattedMessage
                                        id="pubinfo.pdf.notes"
                                        defaultMessage="Revision Notes"
                                    />
                                </a>.
                            </div>
                        </div>
                }
            </div>
        </div>
    );
}

function IsbnInfo({model, label, tag}) {
    const entries = ['10', '13'].map((number) => {
        const value = model[`${tag}Isbn${number}`];

        return {
            number,
            value
        };
    })
        .filter((entry) => entry.value);

    if (entries.length === 0) {
        return null;
    }

    return (
        <React.Fragment>
            <div className={`loc-${tag}-isbn`}>
                <h4>{`${label}:`}</h4>
                {
                    entries.map(({number, value}) =>
                        <div key={value}>{`ISBN-${number}: ${value}`}</div>
                    )
                }
            </div>
        </React.Fragment>
    );
}

function LicenseIcon({name}) {
    const icon = name.match(/share/i) ?
        '/dist/images/details/by-nc-sa.svg' : '/dist/images/details/by.svg';

    return (
        <img src={icon} alt="" height="42" width="120" />
    );
}

function LicenseInfo({name, text, title, version}) {
    if (!name) {
        return null;
    }

    return (
        <div className="loc-license">
            <h4>
                <FormattedMessage
                    id="pubInfo.license.heading"
                    defaultMessage="License"
                />:
            </h4>
            <LicenseIcon name={name} />
            <div>
                {
                    text ?
                        <RawHTML html={text} /> :
                        <div>
                            <FormattedMessage
                                id="pubInfo.license"
                                values={{title, name, version}}
                            />
                        </div>
                }
            </div>
        </div>
    );
}

function PolishIsbn({format, header, model}) {
    const n10 = model[`${format}Isbn10`];
    const n13 = model[`${format}Isbn13`];

    if (!(n10 || n13)) {
        return null;
    }

    return (
        <div className={`loc-${format}-isbn`}>
            <h4>{header}</h4>
            {n10 && <div>ISBN-10: {n10}</div>}
            {n13 && <div>ISBN-13: {n13}</div>}
        </div>
    );
}

function PolishLicense({model}) {
    if (!model.licenseName) {
        return null;
    }

    return (
        <div className="loc-license">
            <h4>Licencja:</h4>
            <LicenseIcon name={model.licenseName} />
            <img src={model.licenseIcon} alt="" />
            <div>
                {
                    model.licenseText ?
                        <RawHTML html={model.licenseText} /> :
                        <div>
                            <RawHTML Tag="span" html={model.title} />
                            by OpenStax jest licencjonowana na licencji
                            <span className="text">{model.licenseName} v{model.licenseVersion}</span>
                        </div>
                }
            </div>
        </div>
    );
}

function PolishPublicationInfo({model}) {
    return (
        <div className="publication-info">
            {
                model.publishDate ?
                    <div className="loc-pub-date">
                        <h4>Data publikacji:</h4>
                        {formatDate(model.publishDate)}
                    </div> : null
            }
            <PolishIsbn header="Wydrukowane:" model={model} format="print" />
            <PolishIsbn header="Wersja cyfrowa:" model={model} format="digital" />
            <PolishLicense model={model} />
        </div>
    );
}

function LabeledDate({label, date, className}) {
    if (!date) {
        return null;
    }
    return (
        <div className={className}>
            <h4>{label}</h4>
            {formatDate(date)}
        </div>
    );
}

export default function PublicationInfo({model, url, polish}) {
    const [webUpdate, setWebUpdate] = useState(model.lastUpdatedWeb);
    const intl = useIntl();
    const [pub, web, hard, paper, dig] = [
        intl.formatMessage({id: 'pubInfo.pub.pub'}),
        intl.formatMessage({id: 'pubInfo.pub.web'}),
        intl.formatMessage({id: 'pubInfo.pub.hard'}),
        intl.formatMessage({id: 'pubInfo.pub.paper'}),
        intl.formatMessage({id: 'pubInfo.pub.dig'})
    ];
    const iBooksLabel = model.ibookVolume2Isbn10 || model.ibookVolume2Isbn13 ?
        intl.formatMessage({id: 'getit.ibooks.part1'}) : 'iBooks';
    const labelPart2 = intl.formatMessage({id: 'getit.ibooks.part2'});

    useEffect(() => {
        const isRex = Boolean(model.webviewRexLink);

        if (isRex) {
            fetchRexRelease(model.webviewRexLink, model.cnxId)
                .then(
                    ({revised}) => setWebUpdate(revised),
                    (err) => console.warn('Error fetching Rex info:', err)
                );
        }
    }, [model]);

    if (polish) {
        return new PolishPublicationInfo({model});
    }

    return (
        <React.Fragment>
            <LabeledDate
                label={pub}
                className="loc-pub-date"
                date={model.publishDate}
            />
            <LabeledDate
                label={web}
                className="loc-web-update-date"
                date={webUpdate}
            />
            <PdfUpdateInfo updateDate={model.lastUpdatedPdf} url={url} />
            <IsbnInfo model={model} label={hard} tag="print" />
            <IsbnInfo model={model} label={paper} tag="printSoftcover" />
            <IsbnInfo model={model} label={dig} tag="digital" />
            <IsbnInfo
                model={model}
                label={iBooksLabel}
                tag="ibook"
            />
            <IsbnInfo model={model} label={labelPart2} tag="ibookVolume2" />
            <LicenseInfo
                name={model.licenseName}
                text={model.licenseText}
                title={model.licenseTitle}
                version={model.licenseVersion}
            />
        </React.Fragment>
    );
}
