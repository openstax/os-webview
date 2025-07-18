import React from 'react';
import {Tabs, Item} from '~/components/tablist/tablist';
import useUserContext from '~/contexts/user';
import {useOpenGiveDialog} from '~/pages/details/common/get-this-title-files/give-before-pdf/use-give-dialog';
import trackLink from '~/pages/details/common/track-link';
import {TrackedMouseEvent} from '~/components/shell/router-helpers/use-link-handler';
import bookTitles from '~/models/book-titles';
import './resources.scss';
import {ResourceHeader, LinkData, K12SubjectData} from './subject';

function LinkWithGiveDialog({
    href,
    book,
    track
}: {
    href: string;
    book: string;
    track: string;
}) {
    const {GiveDialog, openGiveDialog} = useOpenGiveDialog();
    const {userStatus} = useUserContext();
    const trackDownloadClick = React.useCallback(
        (event: React.MouseEvent) => {
            if (userStatus?.isInstructor) {
                bookTitles.then((items) => {
                    const b = items.find((i) => i.title === book);

                    if (b) {
                        trackLink(event as TrackedMouseEvent, b.id.toString());
                    } else {
                        trackLink(event as TrackedMouseEvent);
                    }
                });
            }
        },
        [userStatus, book]
    );

    return (
        <React.Fragment>
            <a href={href} onClick={openGiveDialog} data-track={track}>
                {book}
            </a>
            <GiveDialog
                link={href}
                variant="K12 resource"
                track={track}
                onDownload={trackDownloadClick}
            />
        </React.Fragment>
    );
}

function ResourceLink({data, track}: {data: LinkData; track: string}) {
    const url = data.linkExternal || data.linkDocumentUrl;
    const {isVerified} = useUserContext();

    return (
        <li>
            {data.resourceUnlocked || isVerified ? (
                <LinkWithGiveDialog href={url} book={data.book} track={track} />
            ) : (
                <span>{data.book} (verified instructor only)</span>
            )}
        </li>
    );
}

type ResourceDict = {
    [name: string]: ResourceHeader[];
};

function ResourceToContent({resources}: {resources: ResourceDict}) {
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
                                <ResourceLink
                                    key={r.book}
                                    data={r}
                                    track={name}
                                />
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
    selectedLabel,
    setSelectedLabel
}: {
    data: K12SubjectData;
    labels: string[];
    selectedLabel: string;
    setSelectedLabel: (s: string) => void;
}) {
    const resources = React.useMemo(
        () =>
            ['facultyResourceHeaders', 'studentResourceHeaders'].map((k) =>
                resourceHeadersToResources(data[k as HeaderKeys])
            ),
        [data]
    );

    return (
        <section id="resources">
            <div className="boxed">
                <h1>{data.resourcesHeading}</h1>
                <Tabs
                    aria-label="Resource tabs"
                    selectedKey={selectedLabel}
                    onSelectionChange={setSelectedLabel as (s: unknown) => void}
                >
                    {labels.map((label, i) => (
                        <Item key={label} title={label}>
                            <ResourceToContent resources={resources[i]} />
                        </Item>
                    ))}
                </Tabs>
            </div>
        </section>
    );
}
