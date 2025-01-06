import {useState} from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/helpers/cms-fetch';
import {usePromise} from '~/helpers/use-data';

type Flag = {
    name: string;
    feature_active: boolean;
};

const flagPromise = cmsFetch('flags')
    .then(({all_flags: flags}: {all_flags: Flag[]}) =>
        flags.reduce((a, f) => {
            a[f.name] = f.feature_active;
            return a;
        }, {} as Record<string, boolean>)
    );

function useFlags() {
    return usePromise<Record<string, boolean> | false>(flagPromise, false);
}

function useContextValue() {
    const flags = useFlags();
    const stickyFooterState = useState<boolean | null>(null);

    return {
        flags,
        stickyFooterState
    } as const;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as SharedDataContextProvider};
