import React, {useState, useEffect} from 'react';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import {useIntl} from 'react-intl';
import DetailsTab from './details-tab/details-tab';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import VideoTab from './videos-tab/videos-tab';
import useDetailsContext from '../context';
import {GiveLink} from '../common/common';
import {useNavigate} from 'react-router-dom';
import $ from '~/helpers/$';
import './desktop-view.scss';

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
    const [selectedLabel, setSelectedLabel] = useState($.findSelectedTab(labels));
    const navigate = useNavigate();
    const selectedTab = $.findSelectedTab(labels);

    useEffect(() => {
        setSelectedLabel(selectedTab);
    }, [selectedTab]);

    function updateSelectedLabel(newValue) {
        const newSearchString = $.replaceSearchTerm(labels, selectedLabel, newValue);

        setSelectedLabel(newValue);
        navigate(newSearchString, {replace: true});
    }

    return [selectedLabel, updateSelectedLabel];
}

export default function DesktopView({onContentChange}) {
    const model = useDetailsContext();
    const polish = $.isPolish(model.title);
    const labels = useLabelsFromModel(model, polish);
    const [selectedLabel, setSelectedLabel] = useSelectedLabelTiedToSearchString(labels);
    const TabTag = 'h2';

    useEffect(() => {
        onContentChange(selectedLabel !== 'Book details');
    }, [selectedLabel, onContentChange]);

    return (
        <React.Fragment>
            <div className="tab-controller">
                <TabGroup {...{TabTag, labels, selectedLabel, setSelectedLabel}}>
                    <GiveLink />
                </TabGroup>
            </div>
            <div className="tab-content">
                <ContentGroup activeIndex={labels.indexOf(selectedLabel)}>
                    <DetailsTab polish={polish} model={model} />
                    <InstructorResourceTab model={model} />
                    <StudentResourceTab model={model} />
                    {model.videos[0] && <VideoTab videos={model.videos[0]} />}
                </ContentGroup>
            </div>
        </React.Fragment>
    );
}
