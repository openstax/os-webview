import React from 'react';
import { useLocation } from 'react-router-dom';
import {Tabs, Item} from '~/components/tablist/tablist';
import useUserContext from '~/contexts/user';
import {useOpenGiveDialog} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-give-dialog';
import trackLink from '~/pages/details/common/track-link';
import {TrackedMouseEvent} from '~/components/shell/router-helpers/useLinkHandler';
import './resources.scss';

function LinkWithGiveDialog({href, text, track}: {
    href: string;
    text: string;
    track: string;
}) {
    const {GiveDialog, openGiveDialog} = useOpenGiveDialog();
    const {userStatus} = useUserContext();
    const {pathname} = useLocation();
    const trackDownloadClick = React.useCallback(
        (event: React.MouseEvent) => {
            if (userStatus?.isInstructor) {
                trackLink(event as TrackedMouseEvent, pathname);
            }
        },
        [userStatus, pathname]
    );

    return (
        <React.Fragment>
            <a href={href} onClick={openGiveDialog} data-track={track}>{text}</a>
            <GiveDialog
            link={href} variant='K12 resource' track={track}
            onDownload={trackDownloadClick}
            />
        </React.Fragment>
    );
}

function ResourceLink({ data, track }: {
    data: {
        book: string;
        resourceUnlocked: boolean;
        linkExternal: string;
        linkDocumentUrl: string;
    };
    track: string;
}) {
    const url = data.linkExternal || data.linkDocumentUrl;
    const {isVerified} = useUserContext();

    return (
        <li>
            {
                data.resourceUnlocked || isVerified ?
                <LinkWithGiveDialog href={url} text={data.book} track={track} /> :
                <span>{data.book} (verified instructor only)</span>
            }
        </li>
    );
}

type ResourceHeader = {
    id: string;
    heading: string;
    resourceCategory: string;
    description: string;
    comingSoon: boolean;
    comingSoonText: string;
    k12: boolean;
    videoReferenceNumber: number;
    trackResource: boolean;
    printLink: string;
    book: string;
    icon: string;
    resourceUnlocked: boolean;
    linkExternal: string;
    linkDocumentUrl: string;
};
type ResourceDict = {
    [name: string]: ResourceHeader[];
}

function ResourceToContent({ resources }: {resources: ResourceDict}) {
    return (
        <div className="card-grid">
            {(Reflect.ownKeys(resources) as string[])?.map((name) => {
                const resourceList = resources[name];

                return (
                    <div key={name} className="card">
                        <div className="top">
                            <img src={resourceList[0].icon} alt="" />
                            <h3>{name}</h3>
                        </div>
                        <ul>
                            {resourceList.map((r) => (
                                <ResourceLink key={r.book} data={r} track={name} />
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
function resourceHeadersToResources(resourceHeaders: ResourceHeader[]) {
    return resourceHeaders.reduce<{[key: string]: ResourceHeader[]}>((a, b) => {
        if (!(b.heading in a)) {
            a[b.heading] = [];
        }
        a[b.heading].push(b);
        return a;
    }, {});
}

type HeaderKeys = 'facultyResourceHeaders' | 'studentResourceHeaders';
export default function Resources({
    data,
    labels,
    selectedLabel
}: {
    data: {
        resourcesHeading: string;
        facultyResourceHeaders: ResourceHeader[];
        studentResourceHeaders: ResourceHeader[];
    };
    labels: string[];
    selectedLabel: string;
}) {
    const resources = React.useMemo(
        () => ['facultyResourceHeaders', 'studentResourceHeaders'].map(
            (k) => resourceHeadersToResources(data[k as HeaderKeys])
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
