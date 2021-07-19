import React, {useState, useEffect} from 'react';
import TabGroup from '~/components/tab-group/tab-group.jsx';
import ContentGroup from '~/components/content-group/content-group.jsx';
import DetailsTab from './details-tab/details-tab';
import InstructorResourceTab from './instructor-resource-tab/instructor-resource-tab';
import StudentResourceTab from './student-resource-tab/student-resource-tab';
import VideoTab from './videos-tab/videos-tab';
import useLanguageContext from '~/models/language-context';
import useDetailsContext from '../context';
import {GiveLink} from '../common/common';
import $ from '~/helpers/$';
import './desktop-view.scss';

const tabsByLanguage = {
    en: [
        'Book details',
        'Instructor resources',
        'Student resources',
        'Videos'
    ],
    es: [
        'Detalles del libro',
        'Recursos del instructor',
        'Recursos para estudiantes',
        'Videos'
    ]
};

// eslint-disable-next-line complexity
function useLabelsFromModel(model, polish) {
    const {language} = useLanguageContext();
    const labelSet = tabsByLanguage[language];
    const tabLabels = [polish ? 'Szczegóły książki' : labelSet[0]];

    if (!polish && model.freeStuffInstructor.content) {
        tabLabels.push(labelSet[1]);
    }
    if (!polish && model.freeStuffStudent.content) {
        tabLabels.push(labelSet[2]);
    }
    if (model.videos.length) {
        tabLabels.push(labelSet[3]);
    }

    return tabLabels;
}

function useSelectedLabelTiedToSearchString(labels) {
    const [selectedLabel, setSelectedLabel] = useState($.findSelectedTab(labels));

    function updateSelectedLabel(newValue) {
        const newSearchString = $.replaceSearchTerm(labels, selectedLabel, newValue);

        setSelectedLabel(newValue);
        window.history.replaceState({}, '', newSearchString);
        window.dispatchEvent(new window.CustomEvent('navigate'));
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
