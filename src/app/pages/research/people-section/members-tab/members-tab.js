import React from 'react';
import LinkOrNot from '../../link-or-not';
import './members-tab.css';

export default function MembersTab({data}) {
    return (
        <div className="members-tab">
            {
                data.map((entry) =>
                    <div key={entry.name} className="card">
                        <div className="content">
                            <div className="image-holder">
                                {
                                    entry.photo &&
                                        <img className="photo" src={entry.photo.file} alt="portrait" />
                                }
                            </div>
                            <div className="name">
                                <LinkOrNot url={entry.website}>
                                    {entry.name}
                                </LinkOrNot>
                            </div>
                            <div>{entry.title}</div>
                        </div>
                    </div>
                )
            }
        </div>
    );
}
