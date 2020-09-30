import React, {useState, useEffect} from 'react';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import DetailsTab from './details-tab/details-tab';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import VideoTab from './videos-tab/videos-tab';
import {GiveLink} from '../common/common';
import $ from '~/helpers/$';
import './desktop-view.css';

// eslint-disable-next-line complexity
function labelsFromModel(model, polish) {
    const tabLabels = [polish ? 'Szczegóły książki' : 'Book details'];

    if (!polish && model.freeStuffInstructor.content) {
        tabLabels.push('Instructor resources');
    }
    if (!polish && model.freeStuffStudent.content) {
        tabLabels.push('Student resources');
    }
    if (model.videos.length) {
        tabLabels.push('Videos');
    }

    return tabLabels;
}

function useSelectedLabelTiedToSearchString(labels) {
    const [selectedLabel, setSelectedLabel] = useState($.findSelectedTab(labels));

    function updateSelectedLabel(newValue) {
        const newSearchString = $.replaceSearchTerm(labels, selectedLabel, newValue);

        setSelectedLabel(newValue);
        window.history.replaceState({}, '', newSearchString);
        window.dispatchEvent(new CustomEvent('navigate'));
    }

    return [selectedLabel, updateSelectedLabel];
}

export default function ({model, tocState, onContentChange}) {
    const polish = $.isPolish(model.title);
    const labels = labelsFromModel(model, polish);
    const [selectedLabel, setSelectedLabel] = useSelectedLabelTiedToSearchString(labels);
    const TabTag = 'h2';

    useEffect(() => {
        onContentChange(selectedLabel !== 'Book details');
    }, [selectedLabel]);

    return (
        <React.Fragment>
            <div className="tab-controller">
                <TabGroup {...{TabTag, labels, selectedLabel, setSelectedLabel}} />
                <GiveLink />
            </div>
            <div className="tab-content">
                <ContentGroup activeIndex={labels.indexOf(selectedLabel)}>
                    <DetailsTab polish={polish} model={model} tocState={tocState} />
                    <InstructorResourceTab model={model} />
                    <StudentResourceTab model={model} />
                    {model.videos[0] && <VideoTab videos={model.videos[0]} />}
                </ContentGroup>
            </div>
        </React.Fragment>
    );
}
