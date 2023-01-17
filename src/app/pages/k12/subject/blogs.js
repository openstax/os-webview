import React from 'react';
import './blogs.scss';

const data = {heading: 'Blogs for high school teachers'};

export default function Blogs() {
    return (
        <section className='blogs'>
            <div className='boxed'>
                <h1>{data.heading}</h1>
            </div>
        </section>
    );
}
