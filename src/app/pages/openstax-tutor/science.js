import React, {useLayoutEffect} from 'react';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import 'particles.js/particles';
import particleConfig from './particlesjs-config';

export default function Science({model}) {
    useLayoutEffect(() => {
        window.particlesJS('particles', particleConfig);
    }, []);

    return (
        <section id="science">
            <div id="particles" />
            <div class="text-content">
                <h1>{model.section5ScienceHeading}</h1>
                <RawHTML html={model.section5ScienceParagraph} />
            </div>
        </section>
    );
}
