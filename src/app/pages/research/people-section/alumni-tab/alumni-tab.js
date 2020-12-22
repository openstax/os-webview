import React from 'react';
import LinkOrNot from '../../link-or-not';
import './alumni-tab.css';

export default function AlumniTab({data}) {
    return (
        <div class="alumni-tab">
            <div class="card-container">
                {
                    data.map((entry) =>
                        <div class="entry" key={entry.name}>
                            <div class="name">
                                <LinkOrNot url={entry.website}>
                                    {entry.name}
                                </LinkOrNot>
                            </div>
                            <div class="description">{entry.title}</div>
                        </div>
                    )
                }
            </div>
        </div>
    );
}
