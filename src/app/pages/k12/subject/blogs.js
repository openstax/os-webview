import React from 'react';
import './blogs.scss';

export default function Blogs({data}) {
    return (
        <section className='blogs'>
            <div className='boxed'>
                <h1>{data.blogsHeading}</h1>
            </div>
        </section>
    );
}
