import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './banner.scss';

const data = {
    heading: 'The textbooks you need - for free!',
    description: `We're
    on a mission to change the way high school students learn by
    providing free, high-quality peer-reviewed textbooks and
    support resources. Join us by adopting our educational
    resources in your classroom today!`,
    subjects: [
        {html: 'Algebra', value: 'algebra'},
        {html: 'Anatomy &amp; Physiology', value: 'anatomy-and-physiology'},
        {html: 'Astronomy', value: 'astronomy'},
        {html: 'Biology', value: 'biology'},
        {html: 'Calculus', value: 'calculus'},
        {html: 'College Success', value: 'college-success'}
    ]
};

export default function Banner() {
    return (
        <section className="banner">
            <div className="boxed">
                <div className="text-block">
                    <h1>{data.heading}</h1>
                    <div>{data.description}</div>
                    <div className="buttons">

                        <select className="classic">
                            <option>Find Your Subject</option>
                            {
                                data.subjects.map((s) =>
                                    <RawHTML Tag="option" key={s.value} value={s.value} html={s.html} />)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div className="right-bg clipped-image" style="background-image: url(https://osk12-test.herokuapp.com/static/images/banner_img.png);">
            </div>
        </section>
    );
}
