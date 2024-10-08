import React from 'react';
import useSharedDataContext from '~/contexts/shared-data';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

// Loaded using import(), so it must remain JS

function useFeatureFlag() {
    const {flags: {new_subjects: flag}} = useSharedDataContext();

    return flag;
}

const NewPage = loadable({
    loader: () => import('./new/load-subjects.js'),
    loading: LoadingPlaceholder
});

export default function PickVersion() {
    const featureFlag = useFeatureFlag();

    if (featureFlag === null) {
        return null;
    }

    return (<NewPage />);
}
