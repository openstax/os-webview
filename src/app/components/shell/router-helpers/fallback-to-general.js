import React from 'react';
import Error404 from '~/pages/404/404';
import {useToggle} from '~/helpers/data';
import {GeneralPageFromSlug} from '~/pages/general/general';

export default function FallbackToGeneralPage({name}) {
    const [fallback, setFallback] = useToggle(false);

    return fallback ? (
        <Error404 />
    ) : (
        <GeneralPageFromSlug slug={`spike/${name}`} fallback={setFallback} />
    );
}
