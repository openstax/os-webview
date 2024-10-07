import React from 'react';
import LoaderPage from '~/components/jsx-helpers/loader-page';
import RawHTML from '~/components/jsx-helpers/raw-html';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faCopy} from '@fortawesome/free-regular-svg-icons/faCopy';
import cn from 'classnames';
import './ally-logos.scss';

type AllyLogoData = {
    id: number;
    file: string;
    title: string;
};

function AllyLogo({data: {file, title}}: {data: AllyLogoData}) {
    const copyToClipboard = React.useCallback(
        () => window.navigator.clipboard.writeText(file),
        [file]
    );

    return (
        <div className="icon-and-url">
            <img src={file} alt={title} />
            <span className="url-field-and-button">
                <span className="url">{file}</span>
                <button
                    type="button"
                    aria-label="copy to clipboard"
                    onClick={copyToClipboard}
                >
                    <FontAwesomeIcon icon={faCopy} />
                </button>
            </span>
        </div>
    );
}

type LogoSectionArgs = {
    heading: string;
    description: string;
    logos: {image: AllyLogoData}[];
    className?: string;
};

function LogoSection({
    heading,
    description,
    logos,
    className
}: LogoSectionArgs) {
    return (
        <section className={cn('boxed', className)}>
            <h2>{heading}</h2>
            <RawHTML html={description} />
            <div className="ally-logo-grid">
                {logos.map(({image}) => (
                    <AllyLogo key={image.id} data={image} />
                ))}
            </div>
        </section>
    );
}

type AllyLogosData = Pick<LogoSectionArgs, 'heading' | 'description'> & {
    allyLogosHeading: string;
    allyLogosDescription: string;
    allyLogos: [LogoSectionArgs['logos']];
    bookAllyLogosHeading: string;
    bookAllyLogosDescription: string;
    bookAllyLogos: [LogoSectionArgs['logos']];
};

function AllyLogos({
    data: {
        heading,
        description,
        allyLogosHeading,
        allyLogosDescription,
        allyLogos: [allyLogos],
        bookAllyLogosHeading,
        bookAllyLogosDescription,
        bookAllyLogos: [bookAllyLogos]
    }
}: {
    data: AllyLogosData;
}) {
    return (
        <React.Fragment>
            <section className="text-content">
                <h1>{heading}</h1>
                <RawHTML html={description} />
            </section>
            <LogoSection
                heading={allyLogosHeading}
                description={allyLogosDescription}
                logos={allyLogos}
            />
            <LogoSection
                heading={bookAllyLogosHeading}
                description={bookAllyLogosDescription}
                logos={bookAllyLogos}
                className="book-icons"
            />
        </React.Fragment>
    );
}

export default function AllyLogosLoader() {
    return (
        <main className="ally-logos page">
            <LoaderPage
                slug="pages/ally-logos"
                Child={AllyLogos}
                doDocumentSetup
            />
        </main>
    );
}
