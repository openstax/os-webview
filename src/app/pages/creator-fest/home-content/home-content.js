import React from 'react';
import About from './about/about';
import Why from './why/why';
import './home-content.css';

export default function HomeContent({pagePanels, register}) {
    return (
        <div className="home">
            <About data={pagePanels[0]} register={register} />
            {
                pagePanels.slice(1).map((data, i) =>
                    <Why data={data} key={i} />
                )
            }
        </div>
    );
}
