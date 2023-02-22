import React from 'react';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import './resources.scss';

function ResourceLink({data}) {
    const url = data.linkExternal || data.linkDocumentUrl;

    return (
        <li>
            <a href={url}>{data.book}</a>
        </li>
    );
}

function ResourceToContent({resources}) {
    return (
        <div className="card-grid">
            {
                Reflect.ownKeys(resources)?.map(
                    (name) => {
                        const resourceList = resources[name];

                        return (
                            <div key={name} className="card">
                                <div className="top">
                                    <img src={resourceList[0].icon} alt="" />
                                    <h3>{name}</h3>
                                </div>
                                <ul>
                                    {resourceList.map((r) => <ResourceLink key={r.book} data={r} />)}
                                </ul>
                            </div>
                        );
                    }
                )
            }
        </div>
    );
}

// Resource headers have one entry for each heading/book combo
// Need to group them by heading`
function resourceHeadersToResources(resourceHeaders) {
    return resourceHeaders.reduce(
        (a, b) => {
            if (!(b.heading in a)) {
                a[b.heading] = [];
            }
            a[b.heading].push(b);
            return a;
        },
        {}
    );
}

export default function Resources({data}) {
    const labels = ['Instructor resources', 'Student resources'];
    const [selectedLabel, setSelectedLabel] = React.useState(labels[0]);
    const studentResources = React.useMemo(
        () => resourceHeadersToResources(data.studentResourceHeaders),
        [data]
    );
    const instructorResources = React.useMemo(
        () => resourceHeadersToResources(data.facultyResourceHeaders),
        [data]
    );

    return (
        <section id="resources">
            <div className="boxed">
                <h1>{data.resourcesHeading}</h1>
                <TabGroup {...{labels, selectedLabel, setSelectedLabel}} />
                <ContentGroup activeIndex={labels.indexOf(selectedLabel)}>
                    <ResourceToContent resources={instructorResources} />
                    <ResourceToContent resources={studentResources} />
                </ContentGroup>
            </div>
        </section>
    );
}
