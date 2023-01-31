import React from 'react';
import RawHTML from '~/components/jsx-helpers/raw-html';
import './banner.scss';

const subjectLabel = 'Find your subject';
const subjects= [
    {html: 'Algebra', value: 'algebra'},
    {html: 'Anatomy &amp; Physiology', value: 'anatomy-and-physiology'},
    {html: 'Astronomy', value: 'astronomy'},
    {html: 'Biology', value: 'biology'},
    {html: 'Calculus', value: 'calculus'},
    {html: 'College Success', value: 'college-success'}
];

export default function Banner({data}) {
    return (
        <section className="banner">
            <div className="boxed">
                <div className="text-block">
                    <h1>{data.bannerHeadline}</h1>
                    <div>{data.bannerDescription}</div>
                    <div className="buttons">

                        <select className="classic">
                            <option>{subjectLabel}</option>
                            {
                                subjects.map((s) =>
                                    <RawHTML Tag="option" key={s.value} value={s.value} html={s.html} />)
                            }
                        </select>
                    </div>
                </div>
            </div>
            <div
                className="right-bg clipped-image"
                style={`background-image: url(${data.bannerRightImage.meta.downloadUrl});`}
            >
            </div>
        </section>
    );
}
