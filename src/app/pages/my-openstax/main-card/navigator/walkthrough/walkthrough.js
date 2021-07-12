import React from 'react';
import PutAway from '~/pages/my-openstax/put-away/put-away';
import NavigationContext from '../navigation-context';
import WalkthroughCookieContext from './walkthrough-cookie-context';
import './walkthrough.scss';

// These parallel the section IDs
const wtStates = [
    {
        text: `This is where you can find your books. You can click on a book to
        open its details and content, or add a new book to your collection.`,
        buttonText: 'Next',
        stepText: 'Step 1 of 3'
    },
    {
        text: `We’ve collected some useful resources, tools, and links to help
        you get started or learn more about using OpenStax. Explore them here!`,
        buttonText: 'Next',
        stepText: 'Step 2 of 3'
    },
    {
        text: `From this page, you can see and edit your personal information,
        contact details, role and affiliations, and email preferences.`,
        buttonText: 'Done',
        stepText: 'Step 3 of 3'
    }
];

export default function Walkthrough({title, active, index}) {
    const {activeId, setActiveId, targetIds} = React.useContext(NavigationContext);
    const [showWalkthrough, hideWalkthrough] = React.useContext(WalkthroughCookieContext);
    const step = targetIds.indexOf(activeId);
    const wtState = wtStates[step];
    const next = () => {
        if (step < targetIds.length - 1) {
            setActiveId(targetIds[step + 1]);
        } else {
            hideWalkthrough();
        }
    };

    React.useEffect(() => {
        setActiveId(targetIds[0]);
    }, [setActiveId, targetIds]);

    if (!showWalkthrough || !active) {
        return null;
    }

    return (
        <div className="walkthrough-dialog" data-index={index}>
            <dialog>
                <div className="title-bar">
                    {title}
                    <PutAway onClick={hideWalkthrough} />
                </div>
                <div className="text-content">
                    <div className="text-block">
                        {wtState.text}
                    </div>
                    <div className="bottom-row">
                        <div className="step-info">
                            {wtState.stepText}
                        </div>
                        <button type="button" className="primary" onClick={next}>
                            {wtState.buttonText}
                        </button>
                    </div>
                </div>
            </dialog>
        </div>
    );
}
