import React from 'react';
import useSharedDataContext from '~/contexts/shared-data';
import {useLocation} from 'react-router-dom';
import loadable from 'react-loadable';
import LoadingPlaceholder from '~/components/loading-placeholder/loading-placeholder';

function useFeatureFlag() {
    const {flags: {new_subjects: flag}} = useSharedDataContext();

    return flag;
}

function SelectedComponent({featureFlag}) {
    const OldPage = loadable({
        loader: () => import('./old/subjects.js'),
        loading: LoadingPlaceholder
    });
    const NewPage = loadable({
        loader: () => import('./new/subjects.js'),
        loading: LoadingPlaceholder
    });

    return (
        featureFlag ? <NewPage /> : <OldPage />
    );
}

export default function PickVersion() {
    const {pathname} = useLocation();
    const featureFlag = useFeatureFlag();
    const override = pathname.includes('-preview');

    if (featureFlag === null) {
        return null;
    }

    return (<SelectedComponent featureFlag={featureFlag || override} />);
}
