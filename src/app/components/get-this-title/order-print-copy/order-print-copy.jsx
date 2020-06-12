import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function Header({icon, heading, content}) {
    return (
        <React.Fragment>
            <h1>
                <FontAwesomeIcon icon={icon} />
                {heading}
            </h1>
            <RawHTML html={content} />
        </React.Fragment>
    );
}

function Button({href, text, buttonClass, onClick}) {
    return (
        <a className={`btn ${buttonClass}`} href={href} onClick={onClick}>
            {text}
        </a>
    );
}

export default function OrderPrintCopy({bookstoreContent, amazonLink, closeAfterDelay}) {
    return (
        <React.Fragment>
            <div className={`phone-version boxes boxes-${bookstoreContent.length}`}>
                {
                    bookstoreContent.map((entry) =>
                        <a className="box" href={entry.button_url || amazonLink}
                            onClick={closeAfterDelay}
                        >
                            <Header icon={entry.button_url ? 'users' : 'user'}
                                heading={entry.heading}
                                content={entry.content}
                            />
                        </a>
                    )
                }
            </div>
            <div className={`larger-version boxes boxes-${bookstoreContent.length}`}>
                {
                    bookstoreContent.map((entry, index) => {
                        const urlButtonClass = index < 2 ? 'secondary' : '';
                        const buttonClass = entry.button_url ? urlButtonClass : 'primary';

                        return (<div className="box">
                            <Header icon={entry.button_url ? 'users' : 'user'}
                                heading={entry.heading}
                                content={entry.content}
                            />
                            <Button href={entry.button_url || amazonLink}
                                buttonClass={buttonClass}
                                onClick={closeAfterDelay}
                                text={entry.button_text}
                            />
                        </div>);
                    })
                }
            </div>
        </React.Fragment>
    );
}
