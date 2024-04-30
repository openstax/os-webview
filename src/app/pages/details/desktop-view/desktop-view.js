import React, {useState, useEffect} from 'react';
import TabGroup from '~/components/tab-group/tab-group';
import ContentGroup from '~/components/content-group/content-group';
import {useIntl} from 'react-intl';
import VideoTab from './videos-tab/videos-tab';
import useDetailsContext from '../context';
import {GiveLink} from '../common/common';
import {useNavigate} from 'react-router-dom';
import $ from '~/helpers/$';
import JITLoad from '~/helpers/jit-load';
import {findSelectedTab, replaceSearchTerm} from '../common/tab-utils';
import './desktop-view.scss';

const importDetailsTab = () => import('./details-tab/details-tab.js');
const importInstructorTab = () => import('./instructor-resource-tab/instructor-resource-tab.js');
const importStudentTab = () => import('./student-resource-tab/student-resource-tab.js');

// eslint-disable-next-line complexity
function useLabelsFromModel(model, polish) {
    const intl = useIntl();
    const tabLabels = [polish ? 'Szczegóły książki' : intl.formatMessage({
        id: 'tabs.bookDetails'
    })];

    if (!polish && model.freeStuffInstructor.content) {
        tabLabels.push(intl.formatMessage({
            id: 'tabs.instructorResources'
        }));
    }
    if (!polish && model.freeStuffStudent.content) {
        tabLabels.push(intl.formatMessage({
            id: 'tabs.studentResources'
        }));
    }
    if (model.videos.length) {
        tabLabels.push(intl.formatMessage({
            id: 'tabs.videos'
        }));
    }

    return tabLabels;
}

function useSelectedLabelTiedToSearchString(labels) {
    const navigate = useNavigate();
    const selectedTab = findSelectedTab(labels);
    const updateSelectedLabel = React.useCallback(
        (newValue) => {
            const newSearchString = replaceSearchTerm(labels, selectedTab, newValue);

            navigate(newSearchString, {replace: true});
        },
        [labels, navigate, selectedTab]
    );

    return [selectedTab, updateSelectedLabel];
}

function StubUntilSeen({active, ...JLParams}) {
    const [seen, setSeen] = useState(false);

    useEffect(
        () => {
            if (active) {
                setSeen(true);
            }
        },
        [active]
    );

    return (
        seen ? <JITLoad {...JLParams} /> : <div />
    );
}

export default function DesktopView() {
    const model = useDetailsContext();
    const polish = $.isPolish(model.title);
    const labels = useLabelsFromModel(model, polish);
    const [selectedLabel, setSelectedLabel] = useSelectedLabelTiedToSearchString(labels);
    const TabTag = 'h2';
    const activeIndex = labels.indexOf(selectedLabel);
    const isShowingCards = selectedLabel !== 'Book details';
    const setUseCardBackground = model.setUseCardBackground;

    useEffect(() => setUseCardBackground(isShowingCards), [isShowingCards, setUseCardBackground]);

    return (
        <React.Fragment>
            <div className="tab-controller">
                <TabGroup
                    {...{TabTag, labels, selectedLabel, setSelectedLabel}}
                    data-analytics-nav="Book Details Tabs"
                    listLabel="Book Info Tabs"
                >
                    <GiveLink />
                </TabGroup>
            </div>
            <div className="tab-content">
                <ContentGroup activeIndex={activeIndex} labels={labels}>
                    <StubUntilSeen active={activeIndex===0} importFn={importDetailsTab} polish={polish} model={model} />
                    <StubUntilSeen active={activeIndex===1} importFn={importInstructorTab} model={model} />
                    <StubUntilSeen active={activeIndex===2} importFn={importStudentTab} model={model} />
                    {model.videos[0] && <VideoTab videos={model.videos[0]} />}
                </ContentGroup>
            </div>
        </React.Fragment>
    );
}
