import React from 'react';

export default function useLayoutParameters() {
    const [layoutName, setLayoutName] = React.useState('default');
    const [layoutData, setLayoutData] = React.useState<unknown>(undefined);
    const setLayoutParameters = React.useCallback(
        // eslint-disable-next-line no-shadow
        ({name, data}: { name: string; data: unknown;}) => {
            setLayoutName(name);
            // Optimization: it doesn't matter whether data gets reset if it is undefined
            if (JSON.stringify(data) !== JSON.stringify(layoutData) && data !== undefined) {
                setLayoutData(data);
            }
        },
        [layoutData]
    );

    return {layoutName, layoutData, setLayoutParameters};
}