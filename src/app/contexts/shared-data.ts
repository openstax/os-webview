import buildContext from '~/components/jsx-helpers/build-context';
import cmsFetch from '~/helpers/cms-fetch';
import {usePromise} from '~/helpers/use-data';

type FlagName = 'myox_pardot' | 'my_openstax' | 'new_subjects';

type Flag = {
    name: FlagName;
    feature_active: boolean;
};

const flagPromise = cmsFetch('flags')
    .then(({all_flags: flags}: {all_flags: Flag[]}) =>
        flags.reduce((a, f) => {
            a[f.name] = f.feature_active;
            return a;
        }, {} as Record<FlagName, boolean>)
    );

function useFlags() {
    return usePromise<Record<FlagName, boolean> | false>(flagPromise, false);
}

function useContextValue() {
    const flags = useFlags();

    return {
        flags
    } as const;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as SharedDataContextProvider};
