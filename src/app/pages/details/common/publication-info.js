import React, {useState, useEffect} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {formatDateForBlog as formatDate} from '~/helpers/data';
import fetchRexRelease from '~/models/rex-release';
import useDetailsContext from '~/pages/details/context';

const localizedTexts = {
    'en': {
        pdf: {
            heading: 'PDF Version Last Updated:',
            see: 'See changes in the',
            notes: 'Revision Notes'
        },
        license: {
            heading: 'License',
            beforeTitle: '',
            byline: 'by OpenStax is licensed under'
        },
        pub: {
            pub: 'Publish Date:',
            web: 'Web Version Last Updated:',
            hard: 'Hardcover',
            paper: 'Paperback',
            dig: 'Digital',
            part: 'Part'
        }
    },
    'es': {
        pdf: {
            heading: 'Última actualización de la versión PDF:',
            see: 'Ver las modificaciones en las',
            notes: 'Notas de revisión'
        },
        license: {
            heading: 'Licencia',
            beforeTitle: 'El libro',
            byline: 'de OpenStax tiene la licencia'
        },
        pub: {
            pub: 'Fecha de publicación:',
            web: 'Última actualización de la versión web:',
            hard: 'Tapa dura',
            paper: 'Edición de bolsillo',
            dig: 'Edición digital',
            part: 'Parte'
        }
    }
};

function PdfUpdateInfo({updateDate, url}) {
    const {language} = useDetailsContext();
    const texts = localizedTexts[language].pdf;

    if (!updateDate) {
        return null;
    }

    return (
        <div className="loc-pdf-update-date">
            <div className="callout-container">
                <h4>{texts.heading}</h4>
                {formatDate(updateDate)}
                {
                    url &&
                        <div className="callout">
                            <div>
                                {texts.see}{' '}
                                <a href={url}>{texts.notes}</a>.
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
        '/images/details/by-nc-sa.svg' : '/images/details/by.svg';

    return (
        <img src={icon} alt="" height="42" width="120" />
    );
}

function LicenseInfo({name, text, title, version}) {
    const {language} = useDetailsContext();
    const texts = localizedTexts[language].license;

    if (!name) {
        return null;
    }

    return (
        <div className="loc-license">
            <h4>{texts.heading}:</h4>
            <LicenseIcon name={name} />
            <div>
                {
                    text ?
                        <RawHTML html={text} /> :
                        <div>
                            {texts.beforeTitle}{texts.beforeTitle ? ' ' : ''}
                            <RawHTML Tag="span" html={title} />
                            {texts.byline}{' '}
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
    const {language} = useDetailsContext();
    const texts = localizedTexts[language].pub;

    useEffect(() => {
        const isTutor = model.webviewRexLink?.includes('tutor');
        const isRex = !isTutor && Boolean(model.webviewRexLink);

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
                label={texts.pub}
                className="loc-pub-date"
                date={model.publishDate}
            />
            <LabeledDate
                label={texts.web}
                className="loc-web-update-date"
                date={webUpdate}
            />
            <PdfUpdateInfo updateDate={model.lastUpdatedPdf} url={url} />
            <IsbnInfo model={model} label={texts.hard} tag="print" />
            <IsbnInfo model={model} label={texts.paper} tag="printSoftcover" />
            <IsbnInfo model={model} label={texts.dig} tag="digital" />
            <IsbnInfo
                model={model}
                label={model.ibookVolume2Isbn10 || model.ibookVolume2isbn13 ? `iBooks ${texts.part} 1` : 'iBooks'}
                tag="ibook"
            />
            <IsbnInfo model={model} label={`iBooks ${texts.part} 2`} tag="ibook" />
            <LicenseInfo
                name={model.licenseName}
                text={model.licenseText}
                title={model.licenseTitle}
                version={model.licenseVersion}
            />
        </React.Fragment>
    );
}
