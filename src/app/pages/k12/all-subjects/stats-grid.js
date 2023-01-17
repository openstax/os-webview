import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './stats-grid.scss';

function StatsChecklistItem({imgSrc, heading, text}) {
    return (
        <React.Fragment>
            <img src={imgSrc} alt="checkmark" />
            <div>
                <strong>{heading}</strong>
                <div>{text}</div>
            </div>
        </React.Fragment>
    );
}

function StatsCard({line1, line2, imgSrc}) {
    const style = imgSrc ? {backgroundImage: `url(${imgSrc})`} : null;

    return (
        <div className="card" style={style}>
            {line1 ? <strong>{line1}</strong> : null}
            {line2 ? <div>{line2}</div> : null}
        </div>
    );
}

export default function StatsGrid() {
    const headerText = `OpenStax textbooks are easy to adopt. Simply <a href="subjects">find your subject</a>,
    select your book and
    integrate your new materials into your coursework in the way
    that works best for your students.`;
    const checklistItems = [
        {
            heading: 'Faculty-Driven and Research-Backed',
            text: `OpenStax textbooks are written by subject matter experts and extensively reviewed
            for accuracy.
            Plus, they're regularly updated to ensure the highest-quality possible.`
        },
        {
            heading: 'All the Benefits of a Traditional Textbook Plus More',
            text: ` No more cramming notes in the margins of your heavy textbooks. With individual
            user accounts,
            teachers and students can save notes and highlight text to review at any time.`
        },
        {
            heading: 'Engage Your Students with Supplemental Resources',
            text: `With tools like instructor slides, question banks, and Google Forms, our supplemental
            resources
            make it easier to create engaging and effective lesson plans.`
        }
    ];
    const gridItems = [
        {
            line1: '100%',
            line2: 'Free - Always'
        },
        {
            imgSrc: 'https://osk12-test.herokuapp.com/static/images/Rectangle_151@2x.ce4ff39894c9.png'
        },
        {
            imgSrc: 'https://osk12-test.herokuapp.com/static/images/Rectangle_152@2x.a3eb88429876.png'
        },
        {
            line1: '+10K',
            line2: 'Secondary Teachers'
        },
        {
            line1: '+15',
            line2: 'Subjects'
        },
        {
            imgSrc: 'https://osk12-test.herokuapp.com/static/images/Rectangle_153@2x.70640c47ed8f.png'
        }
    ];

    return (
        <section className="stats-grid">
            <div className="boxed">
                <div>
                    <RawHTML Tag='h3' html={headerText} />
                    <div className="checklist">
                        {
                            checklistItems.map(
                                (item) =>
                                    <StatsChecklistItem
                                        key={item.heading}
                                        imgSrc="https://osk12-test.herokuapp.com/static/images/check_iconsvg.svg"
                                        heading={item.heading}
                                        text={item.text}
                                    />
                            )
                        }
                    </div>
                </div>
                <div className="card-grid">
                    {
                        gridItems.map(
                            (data) => <StatsCard key={data} {...{...data}} />
                        )
                    }
                </div>
            </div>
        </section>
    );
}
