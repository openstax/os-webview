import React from 'react';
import {Tabs, Item} from '~/components/tablist/tablist';
import useUserContext from '~/contexts/user';
import {useOpenGiveDialog} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-give-dialog';
import './resources.scss';

function LinkWithGiveDialog({href, text}) {
    const {GiveDialog, openGiveDialog} = useOpenGiveDialog();

    return (
        <React.Fragment>
            <a href={href} onClick={openGiveDialog}>{text}</a>
            <GiveDialog link={href} variant='K12 resource' />
        </React.Fragment>
    );
}

function ResourceLink({ data }) {
    const url = data.linkExternal || data.linkDocumentUrl;
    const {isVerified} = useUserContext();

    return (
        <li>
            {
                data.resourceUnlocked || isVerified ?
                <LinkWithGiveDialog href={url} text={data.book} /> :
                <span>{data.book} (verified instructor only)</span>
            }
        </li>
    );
}

function ResourceToContent({ resources }) {
    return (
        <div className="card-grid">
            {Reflect.ownKeys(resources)?.map((name) => {
                const resourceList = resources[name];

                return (
                    <div key={name} className="card">
                        <div className="top">
                            <img src={resourceList[0].icon} alt="" />
                            <h3>{name}</h3>
                        </div>
                        <ul>
                            {resourceList.map((r) => (
                                <ResourceLink key={r.book} data={r} />
                            ))}
                        </ul>
                    </div>
                );
            })}
        </div>
    );
}

// Resource headers have one entry for each heading/book combo
// Need to group them by heading`
function resourceHeadersToResources(resourceHeaders) {
    return resourceHeaders.reduce((a, b) => {
        if (!(b.heading in a)) {
            a[b.heading] = [];
        }
        a[b.heading].push(b);
        return a;
    }, {});
}

export default function Resources({
    data,
    labels,
    selectedLabel
}) {
    const resources = React.useMemo(
        () => ['facultyResourceHeaders', 'studentResourceHeaders'].map(
            (k) => resourceHeadersToResources(data[k])
        ),
        [data]
    );

    return (
        <section id="resources">
            <div className="boxed">
                <h1>{data.resourcesHeading}</h1>
                <Tabs aria-label="Resource tabs" selectedKey={selectedLabel}>
                    {
                        labels.map((label, i) =>
                            <Item key={label} title={label}>
                                <ResourceToContent resources={resources[i]} />
                            </Item>
                        )
                    }
                </Tabs>
            </div>
        </section>
    );
}
