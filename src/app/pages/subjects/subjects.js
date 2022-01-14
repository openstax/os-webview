import React, {lazy, Suspense} from 'react';
import sample from 'lodash/sample';

function useFeatureFlag() {
    const [flag, setFlag] = React.useState(null);

    React.useEffect(
        () => {
            console.info('Should be calling setflag real soon');
            window.setTimeout(
                setFlag(sample([true, false])),
                300
            );
        },
        []
    );

    return flag;
}

function useSelectedVersion(featureFlag) {
    const importFn = React.useCallback(
        () => {
            if (featureFlag === true) {
                return import('./new/subjects.js');
            }
            return import('./old/subjects.js');
        },
        [featureFlag]
    );
    const Component = React.useMemo(
        () => lazy(() => importFn()),
        [importFn]
    );

    return Component;
}

function SelectedComponent({featureFlag}) {
    const Component = useSelectedVersion(featureFlag);

    return (
        <Suspense fallback={<h1>Loading...</h1>}>
            <Component />
        </Suspense>
    );
}

export default function PickVersion() {
    const featureFlag = useFeatureFlag();

    if (featureFlag === null) {
        return null;
    }

    return (<SelectedComponent featureFlag={featureFlag} />);
}
