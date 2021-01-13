import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import './webinar-list.css';

function DatedHeading({entry}) {
    const start = new Date(entry.start);
    const month = start.toLocaleString('en-us', {month: 'short'});
    const weekday = start.toLocaleString('en-us', {weekday: 'long'});
    const startHour = start.toLocaleString('en-us', {hour: 'numeric', minute: 'numeric'});
    const endHour = new Date(entry.end)
        .toLocaleString('en-us', {hour: 'numeric', minute: 'numeric', timeZoneName: 'short'});
    const dayAndTime = `${weekday}, ${startHour} - ${endHour}`;

    return (
        <React.Fragment>
            <div className="dated-heading">
                <div className="date">
                    <span className="day-of-month">{start.getDate()}</span>
                    <span className="month">{month}</span>
                </div>
                <div className="title-and-time">
                    <div className="with-hovertitle">
                        <h3>{entry.title}</h3>
                        <div className="hovertitle">{entry.title}</div>
                    </div>
                    <span className="day-and-time">{dayAndTime}</span>
                </div>
            </div>
            <hr />
        </React.Fragment>
    );
}

function HoverTitle({entry}) {
    return (
        <div className="with-hovertitle">
            <h3>{entry.title}</h3>
            <div className="hovertitle">{entry.title}</div>
        </div>
    );
}

function WebinarBox({entry, upcoming}) {
    return (
        <div className="card">
            {
                upcoming ?
                    <DatedHeading entry={entry} /> :
                    <HoverTitle entry={entry} />
            }
            <div className="description">{entry.description}</div>
            {
                upcoming &&
                    <div className="speakers-and-spaces">
                        <div className="speakers">
                            <span className="label">Speakers: </span>
                            {entry.speakers}
                        </div>
                        <div className="spaces-remaining">
                            <span className="label">Spaces remaining: </span>
                            {entry.spacesRemaining}
                        </div>
                    </div>
            }
            <a href={entry.registrationUrl}>
                {entry.registrationLinkText}{' '}
                <FontAwesomeIcon icon="chevron-right" />
            </a>
        </div>
    );
}

export default function WebinarList({data, upcoming=false}) {
    return (
        <div className="webinar-list">
            {
                data.map((entry) =>
                    <WebinarBox entry={entry} key={entry.registrationUrl} upcoming={upcoming} />
                )
            }
        </div>
    );
}
