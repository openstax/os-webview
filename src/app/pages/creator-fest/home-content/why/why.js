import React from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './why.css';

export default function Why({ data: {
    superheading,
    heading,
    paragraph: description,
    embed,
    backgroundImage: {image}
}}) {
    const ref = React.useRef();

    React.useEffect(() => {
        const el = ref.current;
        const biStyle = window.getComputedStyle(el).backgroundImage;
        const newStyle = `${biStyle},url('${image}')`;

        el.style.backgroundImage = newStyle;
    }, []);

    return (
        <section className="why" ref={ref}>
            <div className="boxed">
                <div className="super-headline">{superheading}</div>
                <div className="text-block-left">
                    <div>
                        <h2>{heading}</h2>
                        <RawHTML html={description} />
                        <div className="blue-line" />
                    </div>
                    <div className="stack">
                        <div className="possible-decoration" />
                        <div className="possibly-decorated">
                            <RawHTML className="html-block" html={embed} embed />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
