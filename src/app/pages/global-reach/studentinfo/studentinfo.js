import React from 'react';
import './studentinfo.scss';

export default function StudentInfo({
    header1, blurb1, cta1, link1, image1Url,
    header2, blurb2, cta2, link2, image2Url
}) {
    return (
        <div className="studentinfobox">
            <div className="photo-and-text">
                <div>
                    <div className="girl-txt-head">{header1}</div>
                    <p>{blurb1}</p>
                    <a href={link1} className="sbox">{cta1}</a>
                </div>
                <img className="girl-img" src={image1Url} alt="Student" />
            </div>

            <div className="photo-and-text">
                <img className="stick-up" src={image2Url} alt="Student" />
                <div className="first-in-mobile">
                    <div className="std-txt-head">{header2}</div>
                    <p>{blurb2}</p>
                    <a href={link2} className="sbox">{cta2}</a>
                </div>
            </div>
        </div>
    );
}
