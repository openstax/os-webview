import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';

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
        const value = model[`${tag}_isbn_${number}`];

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
                        <div>{`ISBN-${number}: ${value}`}</div>
                    )
                }
            </div>
        </React.Fragment>
    );
}

function LicenseInfo({name, icon, text, title, version}) {
    if (!name) {
        return null;
    }

    return (
        <div className="loc-license">
            <h4>License:</h4>
            <img src={icon} alt="" />
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
    const n10 = model[`${format}_isbn_10`];
    const n13 = model[`${format}_isbn_13`];

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
    if (!model.license_name) {
        return null;
    }

    return (
        <div className="loc-license">
            <h4>Licencja:</h4>
            <img src={model.licenseIcon} alt="" />
            <div>
                {
                    model.license_text ?
                        <RawHTML html={model.license_text} /> :
                        <div>
                            <RawHTML Tag="span" html={model.title} />
                            by OpenStax jest licencjonowana na licencji
                            <span className="text">{model.license_name} v{model.license_version}</span>
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
                model.formattedPublishDate ?
                    <div className="loc-pub-date">
                        <h4>Data publikacji:</h4>
                        {model.formattedPublishDate}
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
    if (polish) {
        return new PolishPublicationInfo({model});
    }

    return (
        <React.Fragment>
            <LabeledDate label="Publish Date:"
                className="loc-pub-date"
                formattedDate={model.formattedPublishDate}
            />
            <LabeledDate label="Web Version Last Updated:"
                className="loc-web-update-date"
                formattedDate={model.formattedWebUpdateDate}
            />
            <PdfUpdateInfo updateDate={model.formattedPDFUpdateDate} url={url} />
            <IsbnInfo model={model} label="Hardcover" tag="print" />
            <IsbnInfo model={model} label="Paperback" tag="print_softcover" />
            <IsbnInfo model={model} label="Digital" tag="digital" />
            <IsbnInfo model={model}
                label={model.ibook_volume_2_isbn_10 || model.ibook_volume_2_isbn_13 ? 'iBooks Part 1' : 'iBooks'}
                tag="ibook"
            />
            <IsbnInfo model={model} label="iBooks Part 2" tag="ibook" />
            <LicenseInfo name={model.license_name}
                icon={model.licenseIcon}
                text={model.license_text}
                title={model.license_title}
                version={model.license_version}
            />
        </React.Fragment>
    );
}
