import React from 'react';
import './people-tab.css';

function PersonCard({entry}) {
    return (
        <div className="card">
            <div className="content">
                <div className="name">{entry.name}</div>
                <div className="bio">{entry.bio}</div>
            </div>
        </div>
    );
}

export default function PeopleTab({data}) {
    return (
        <div className="people-tab">
            {data.map((entry) => <PersonCard entry={entry.value} key={entry.value.id} />)}
        </div>
    );
}
