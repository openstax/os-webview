import React, {useState} from 'react';
import './resource-box.css';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';

function ResourceBox({model}) {
    const comingSoonClass = model.comingSoon ? 'coming-soon' : '';
    const description = model.comingSoon ? `<p>${model.comingSoonText}</p>` : model.description;
    const doubleClass = model.double ? 'double' : '';
    const classNames = ['resource-box', comingSoonClass, doubleClass]
        .filter((n) => n)
        .join(' ');
    const [isNew, updateIsNew] = useState(model.isNew);
    const onClick = (event) => {
        if (model.onClick) {
            model.onClick(event);
        }
        updateIsNew(model.isNew);
    };

    function RootNode({Slot}) {
        return (
            model.link ?
                <a className={classNames} href={model.link.url}
                    data-local={
                        model.iconType === 'lock' ? 'true' : 'false'
                    }
                    onClick={onClick}
                >
                    <Slot />
                </a> :
                <div className={classNames}>
                    <Slot />
                </div>
        );
    }

    return (
        <RootNode Slot={() => (
            <React.Fragment>
                <div className="top">
                    {
                        isNew &&
                        <div className="new-label-container">
                            <span className="new-label">NEW</span>
                        </div>
                    }
                    <div className="top-line">
                        <h3>{model.heading}</h3>
                        {
                            model.creatorFest &&
                                <img
                                    title="This resource was created by instructors at Creator Fest"
                                    src="/images/details/cf-badge.svg"
                                />
                        }
                    </div>
                    <div className="description" dangerouslySetInnerHTML={{__html: description}} />
                </div>
                <div className="bottom">
                    <div className="left">
                        {
                            model.link ? model.link.text : 'Access pending'
                        }
                    </div>
                    <div className="right">
                        <FontAwesomeIcon icon={model.link ? model.iconType : 'lock'} />
                    </div>
                </div>
            </React.Fragment>
        )} />
    );
}

export default function ({models}) {
    return (
        <React.Fragment>
            {
                models.map((model) =>
                    <ResourceBox model={model} key={model.heading} />
                )
            }
        </React.Fragment>
    );
}
