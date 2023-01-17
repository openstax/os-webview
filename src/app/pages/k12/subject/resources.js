import React from 'react';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import './resources.scss';

const data = {
    heading: 'Supplemental resources',
    tabs: [
        {
            heading: 'Teacher resources',
            resources: [
                {
                    iconUrl: '',
                    heading: 'Question Bank',
                    links: [
                        {
                            url: '',
                            text: 'Concepts of Bio'
                        },
                        {
                            url: '',
                            text: 'Microbiology'
                        }
                    ]
                },
                {
                    iconUrl: '',
                    heading: 'Instructor Solutions Manual',
                    links: [
                        {
                            url: '',
                            text: 'Biology 2e'
                        },
                        {
                            url: '',
                            text: 'AP Biology'
                        },
                        {
                            url: '',
                            text: 'Concepts of Biology'
                        }
                    ]
                }
            ]
        },
        {
            heading: 'Student resources',
            resources: [
                {
                    iconUrl: '',
                    heading: 'Studenty Things',
                    links: [
                        {
                            url: '',
                            text: 'AP Biology'
                        }
                    ]
                }
            ]
        }
    ]
};

function ResourceToContent({resources}) {
    return (<div className="card-grid">
        {
            resources.map(
                (d) => <div key={d.heading} className="card">
                    <div className="top">
                        <img src={d.iconUrl} alt="" />
                        <h3>{d.heading}</h3>
                    </div>
                    <ul>
                        {
                            d.links.map(
                                (link) => <li key={link.text}><a href={link.url}>{link.text}</a></li>
                            )
                        }
                    </ul>
                </div>
            )
        }
    </div>);
}

export default function Resources() {
    const labels = data.tabs.map((d) => d.heading);
    const [selectedLabel, setSelectedLabel] = React.useState(labels[0]);
    const resourceTabContents = React.useMemo(
        () => data.tabs.map(
            (tabData) => <ResourceToContent key={tabData.heading} resources={tabData.resources} />
        ),
        []
    );

    console.info('RTC', resourceTabContents);
    return (
        <section className="resources">
            <div className="boxed">
                <h1>{data.heading}</h1>
                <TabGroup {...{labels, selectedLabel, setSelectedLabel}} />
                <ContentGroup activeIndex={labels.indexOf(selectedLabel)}>
                    {resourceTabContents}
                </ContentGroup>
            </div>
        </section>
    );
}
