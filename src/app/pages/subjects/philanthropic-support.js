import React from 'react';
import useSubjectsContext from './context';
import savingsPromise from '~/models/savings';
import useSavingsDataIn, {linkClickTracker} from '~/helpers/savings-blurb';
import {RawHTML, useDataFromPromise} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './philanthropic-support.scss';

function useLastBlurb(data) {
    const {adoptions_count: adoptions, savings} = useDataFromPromise(savingsPromise, {});
    const description = useSavingsDataIn(data.description, adoptions, savings);

    if (!data) {
        return false;
    }
    if (data.heading) {
        return {
            heading: data.heading,
            description
        };
    }
    return description;
}

export default function PhilanthropicSupport() {
    const eventName = 'Microdonation subjects page bottom sentence impact link';
    const {aboutBlurbs} = useSubjectsContext();
    const savingsBlurb = useLastBlurb(aboutBlurbs ? aboutBlurbs[3] : '');

    return (
        <section className="philanthropic-support">
            <div className="text-content" onClick={linkClickTracker(eventName)}>
                <RawHTML Tag="p" className="savings-blurb" html={savingsBlurb} />
            </div>
        </section>
    );
}
