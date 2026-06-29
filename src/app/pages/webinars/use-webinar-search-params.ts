import {useCallback, useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';
import type {SortValue} from '~/components/sort-toggle/sort-toggle';

export type WebinarSearchState = {
    q?: string;
    sort: SortValue;
};

type ParamValue = string | undefined;

export default function useWebinarSearchParams() {
    const [params, setParams] = useSearchParams();
    const state = useMemo<WebinarSearchState>(() => {
        return {
            q: params.get('q') || undefined,
            sort: params.get('sort') === 'newest' ? 'newest' : 'relevance'
        };
    }, [params]);

    const setParam = useCallback(
        (key: keyof WebinarSearchState, value: ParamValue) => {
            const next = new window.URLSearchParams(params);

            if (!value) {
                next.delete(key);
            } else {
                next.set(key, value);
            }
            setParams(next);
        },
        [params, setParams]
    );

    return {...state, setParam};
}
