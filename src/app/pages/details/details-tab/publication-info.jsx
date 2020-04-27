import React from 'react';
import Callout from './callout.jsx';

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
                    <Callout messageHtml={messageHtml} />
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
                        <div dangerouslySetInnerHTML={{__html: text}} /> :
                        <div>
                            <span dangerouslySetInnerHTML={{__html: title}} />
                            by OpenStax is licensed under
                            <span className="text">{name} v{version}</span>
                        </div>
                }
            </div>
        </div>
    );
}

export default function ({model, url}) {
    return (
        <React.Fragment>
            {
                model.formattedPublishDate &&
                <div className="loc-pub-date">
                    <h4>Publish Date:</h4>
                    {model.formattedPublishDate}
                </div>
            }
            {
                model.formattedWebUpdateDate &&
                <div className="loc-web-update-date">
                    <h4>Web Version Last Updated:</h4>
                    {model.formattedWebUpdateDate}
                </div>
            }
            <PdfUpdateInfo updateDate={model.formattedPDFUpdateDate} url={url} />
            <IsbnInfo model={model} label="Print" tag="print" />
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
