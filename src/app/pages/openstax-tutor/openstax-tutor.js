import React, {useState, useEffect, useRef} from 'react';
import {LoaderPage} from '~/components/jsx-helpers/jsx-helpers.jsx';
import $ from '~/helpers/$';
import linkHelper from '~/helpers/link';
import Frontier from './frontier';
import HowItWorks from './how-it-works';
import WhatStudentsGet from './what-students-get';
import Features from './features';
import WhereMoneyGoes from './where-money-goes';
import Science from './science';
import FAQ from './faq';
import LearnMore from './learn-more';
import SectionNavigator from '~/components/section-navigator/section-navigator';
import PulsingDot from './pulsing-dot/pulsing-dot';
import StickyFooter from '~/components/sticky-footer/sticky-footer';
import analytics from '~/helpers/analytics';
import {pageWrapper, SuperbItem} from '~/controllers/jsx-wrapper';
import './openstax-tutor.css';

const availableUrl = '/images/openstax-tutor/available-flag.svg';
const unavailableUrl = '/images/openstax-tutor/unavailable-flag.svg';
const availableImageData = {url: availableUrl, description: 'available'};
const unavailableImageData = {url: unavailableUrl, description: 'not available'};

function OpenstaxTutor({data}) {
    const model = $.camelCaseKeys(data);
    const [sectionIds, setSectionIds] = useState([]);
    const sfRef = useRef(
        new StickyFooter({
            leftButton: {
                link: model.floatingFooterButton1Link,
                text: model.floatingFooterButton1Cta,
                description: model.floatingFooterButton1Caption
            },
            rightButton: {
                link: model.floatingFooterButton2Link,
                text: model.floatingFooterButton2Cta,
                description: model.floatingFooterButton2Caption
            }
        })
    );

    useEffect(() => {
        const elList = Array.from(document.querySelectorAll('section[id]'));

        setSectionIds(elList.map((el) => el.id));
    }, []);

    function pageLinkClick(event) {
        const el = linkHelper.validUrlClick(event);

        if (el) {
            const linkText = el.textContent;

            analytics.sendPageEvent(
                `OXT marketing page [${linkText}] page`,
                'open',
                el.href
            );
            event.stopPropagation();
        }
    }

    function footerClick(event) {
        const el = linkHelper.validUrlClick(event);

        if (el) {
            const linkText = el.textContent;

            analytics.sendPageEvent(
                `OXT marketing page [${linkText}] footer`,
                'open',
                el.href
            );
            event.stopPropagation();
        }
    }

    return (
        <div onClick={pageLinkClick}>
            <div className="floating-tools">
                <SectionNavigator idList={sectionIds} />
                <PulsingDot html={model.popUpText} />
            </div>
            <div className="sticky-footer-region" onClick={footerClick}>
                <SuperbItem component={sfRef.current} />
            </div>
            <Frontier model={model} />
            <HowItWorks model={model} />
            <WhatStudentsGet model={model} />
            <Features model={model} />
            <WhereMoneyGoes model={model} />
            <Science model={model} />
            <div class="divider">
                <img src="/images/openstax-tutor/faq-top-background.svg" alt="boat sailing past icebergs" />
            </div>
            <FAQ model={model} />
            <LearnMore model={model} />
        </div>
    );
}

function OpenstaxTutorLoader() {
    return (
        <LoaderPage slug="pages/openstax-tutor" Child={OpenstaxTutor} />
    );
}

const view = {
    classes: ['openstax-tutor-page', 'page'],
    tag: 'main'
};

export default pageWrapper(OpenstaxTutorLoader, view);

//
//     @on('click a:not([href^="#"])')
//     externalLinkClick(e) {
//         const target = e.delegateTarget;
//         const linkText = target.textContent;
//         const footerEl = this.el.querySelector('.sticky-footer');
//         const pageOrFooter = footerEl.contains(target) ? 'footer' : 'page';
//
//         analytics.sendPageEvent(
//             `OXT marketing page [${linkText}] ${pageOrFooter}`,
//             'open',
//             target.href
//         );
//     }
//
// }
