import React from 'react';
import useSubjectsContext from './context';
import {linkClickTracker} from '~/helpers/savings-blurb';
import {RawHTML} from '~/components/jsx-helpers/jsx-helpers.jsx';
import './philanthropic-support.scss';

const eventName = 'Microdonation subjects page bottom sentence impact link';

/*
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
*/

export default function PhilanthropicSupport() {
    const {philanthropicSupport: savingsBlurb} = useSubjectsContext();

    return (
        <section className="philanthropic-support">
            <div className="content">
                <div className="text-content" onClick={linkClickTracker(eventName)}>
                    <RawHTML Tag="p" className="savings-blurb" html={savingsBlurb} />
                </div>
            </div>
        </section>
    );
}
