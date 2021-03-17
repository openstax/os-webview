import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './banner.css';

export default function Banner({headline, image, content}) {
    const ref = React.useRef();

    React.useEffect(() => {
        const el = ref.current;
        const biStyle = window.getComputedStyle(el).backgroundImage;
        const newStyle = `${biStyle},url('${image}')`;

        el.style.backgroundImage = newStyle;
    }, []);

    return (
        <section id="banner" className="banner hero" ref={ref}>
            <div class="boxed">
                <div class="text-content">
                    <h1>{headline}</h1>
                    <RawHTML html={content} />
                </div>
            </div>
        </section>
    );
}
