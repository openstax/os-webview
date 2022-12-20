import React from 'react';
import LinkOrNot from '../../link-or-not';
import './alumni-tab.scss';

export default function AlumniTab({data}) {
    return (
        <div className="alumni-tab">
            <div className="card-container">
                {
                    data.map((entry) =>
                        <div className="entry" key={entry.name}>
                            <div className="name">
                                <LinkOrNot url={entry.website}>
                                    {entry.name}
                                </LinkOrNot>
                            </div>
                            <div className="description">{entry.title}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
