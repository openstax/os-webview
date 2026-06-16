import {useCallback, useMemo} from 'react';
import {useSearchParams} from 'react-router-dom';

export type BlogSearchState = {
    q?: string;
    subjects: string[];
    collection?: string;
    sort: 'relevance' | 'newest';
};

type ParamValue = string | string[] | undefined;

export default function useBlogSearchParams() {
    const [params, setParams] = useSearchParams();
    const state = useMemo<BlogSearchState>(() => {
        const subjects = params.get('subjects');

        return {
            q: params.get('q') || undefined,
            subjects: subjects ? subjects.split(',').filter(Boolean) : [],
            collection: params.get('collection') || undefined,
            sort: params.get('sort') === 'newest' ? 'newest' : 'relevance'
        };
    }, [params]);

    const setParam = useCallback(
        (key: keyof BlogSearchState, value: ParamValue) => {
            const next = new window.URLSearchParams(params);
            const serialized = Array.isArray(value) ? value.join(',') : value;

            if (!serialized) {
                next.delete(key);
            } else {
                next.set(key, serialized);
            }
            setParams(next);
        },
        [params, setParams]
    );

    return {...state, setParam};
}
