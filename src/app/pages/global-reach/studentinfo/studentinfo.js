import React from 'react';
import './studentinfo.css';

export default function StudentInfo({
    header1, blurb1, cta1, link1, image1Url,
    header2, blurb2, cta2, link2, image2Url
}) {
    return (
        <div className="studentinfobox">
            <div class="photo-and-text">
                <div>
                    <div class="girl-txt-head">{header1}</div>
                    <p>{blurb1}</p>
                    <a href={link1} class="sbox">{cta1}</a>
                </div>
                <img class="girl-img" src={image1Url} alt="Student" />
            </div>

            <div class="photo-and-text">
                <img class="stick-up" src={image2Url} alt="Student" />
                <div class="first-in-mobile">
                    <div class="std-txt-head">{header2}</div>
                    <p>{blurb2}</p>
                    <a href={link2} class="sbox">{cta2}</a>
                </div>
            </div>
        </div>
    );
}
