import React from 'react';
import {Webinar} from '../types';
import LinkWithChevron from '~/components/link-with-chevron/link-with-chevron';
import Byline from '~/components/byline/byline';
import './webinar-grid.scss';

type WebinarGridArgs = {
    webinars: Webinar[];
};
export default function WebinarGrid({webinars}: WebinarGridArgs) {
    return (
        <div className='card-grid'>
            {webinars.map((w) => (
                <WebinarCard key={w.id} data={w} />
            ))}
        </div>
    );
}

function WebinarCard({data}: {data: Webinar}) {
    if (data.start.valueOf() < Date.now()) {
        return <PastWebinar data={data} />;
    }
    return <UpcomingWebinar data={data} />;
}

function PastWebinar({data}: {data: Webinar}) {
    return (
        <div className='card past'>
            <h3>{data.title}</h3>
            <Byline author={data.speakers} date={data.start} />
            <div>{data.description}</div>
            <LinkWithChevron href={data.registrationUrl}>
                {data.registrationLinkText}
            </LinkWithChevron>
        </div>
    );
}

function UpcomingWebinar({data}: {data: Webinar}) {
    const day = data.start.toLocaleString('en-us', {weekday: 'long'});
    const startTime = data.start.toLocaleString('en-us', {
        hour: 'numeric',
        minute: 'numeric'
    });
    const endTime = data.end.toLocaleString('en-us', {
        hour: 'numeric',
        minute: 'numeric',
        timeZoneName: 'short'
    });

    return (
        <div className='card upcoming'>
            <div className='dated-heading'>
                <div className='date'>
                    <div className='day-of-month'>{data.start.getDate()}</div>
                    <div className='month'>
                        {data.start.toLocaleString('en', {month: 'short'})}
                    </div>
                </div>
                <div className='title-and-time'>
                    <h3>{data.title}</h3>
                    <div className='day-and-time'>
                        {day}, {startTime} - {endTime}
                    </div>
                </div>
            </div>
            <hr />
            <div>{data.description}</div>
            <div className='speakers-and-spaces'>
                <div className='speakers'>
                    <span className='label'>Speakers: </span>
                    {data.speakers}
                </div>
            </div>
            <LinkWithChevron href={data.registrationUrl}>
                {data.registrationLinkText}
            </LinkWithChevron>
        </div>
    );
}
