import React from 'react';
import './people-tab.scss';

export type PersonEntry = {
    name: string;
    bio: string;
    photo?: {file: string}
}

function PersonCard({entry}: {entry: PersonEntry}) {
    return (
        <div className="card">
            <div className="content">
                <div className="image-holder">
                    {entry?.photo ? <img src={entry?.photo?.file} alt={entry.name} /> : null}
                </div>
                <div className="name">{entry.name}</div>
                <div className="bio">{entry.bio}</div>
            </div>
        </div>
    );
}

export default function PeopleTab({data}: {
    data: {value: PersonEntry}[];
}) {
    return (
        <div className="people-tab">
            {data.map((entry, i) => <PersonCard entry={entry.value} key={i} />)}
        </div>
    );
}
