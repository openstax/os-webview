import React, {useState, useEffect} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import fetchRexRelease from '~/models/rex-release';

function PdfUpdateInfo({updateDate, url}) {
    if (!(updateDate && url)) {
        return null;
    }
    const messageHtml = `See changes in the <a href="${url}">Revision Notes</a>.`;

    return (
        <div className="loc-pdf-update-date">
            <div className="callout-container">
                <h4>PDF Version Last Updated:</h4>
                {updateDate}
                <div className="callout">
                    <RawHTML html={messageHtml} />
                </div>
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
        '/images/details/by-nc-sa.svg' : '/images/details/by.svg';

    return (
        <img src={icon} alt="" />
    );
}

function LicenseInfo({name, text, title, version}) {
    if (!name) {
        return null;
    }

    return (
        <div className="loc-license">
            <h4>License:</h4>
            <LicenseIcon name={name} />
            <div>
                {
                    text ?
                        <RawHTML html={text} /> :
                        <div>
                            <RawHTML Tag="span" html={title} />
                            by OpenStax is licensed under
                            <span className="text">{name} v{version}</span>
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

function LabeledDate({label, formattedDate, className}) {
    if (!formattedDate) {
        return null;
    }
    return (
        <div className={className}>
            <h4>{label}</h4>
            {formattedDate}
        </div>
    );
}

export default function PublicationInfo({model, url, polish}) {
    const [webUpdate, setWebUpdate] = useState(model.lastUpdatedWeb);

    useEffect(() => {
        const isTutor = model.webviewRexLink.includes('tutor');
        const isRex = !isTutor && Boolean(model.webviewRexLink);

        if (isRex) {
            fetchRexRelease(model.webviewRexLink, model.cnxId)
                .then(({revised}) => setWebUpdate(revised));
        }
    }, [model]);

    if (polish) {
        console.info('Doing polish publication', model);
        return new PolishPublicationInfo({model});
    }

    return (
        <React.Fragment>
            <LabeledDate
                label="Publish Date:"
                className="loc-pub-date"
                formattedDate={formatDate(model.publishDate)}
            />
            <LabeledDate
                label="Web Version Last Updated:"
                className="loc-web-update-date"
                formattedDate={formatDate(webUpdate)}
            />
            <PdfUpdateInfo updateDate={formatDate(model.lastUpdatedPdf)} url={url} />
            <IsbnInfo model={model} label="Hardcover" tag="print" />
            <IsbnInfo model={model} label="Paperback" tag="printSoftcover" />
            <IsbnInfo model={model} label="Digital" tag="digital" />
            <IsbnInfo
                model={model}
                label={model.ibookVolume2Isbn10 || model.ibookVolume2isbn13 ? 'iBooks Part 1' : 'iBooks'}
                tag="ibook"
            />
            <IsbnInfo model={model} label="iBooks Part 2" tag="ibook" />
            <LicenseInfo
                name={model.licenseName}
                text={model.licenseText}
                title={model.licenseTitle}
                version={model.licenseVersion}
            />
        </React.Fragment>
    );
}
