import React from 'react';
import useWebinarSearchParams from '../use-webinar-search-params';
import SortToggle from '~/components/sort-toggle/sort-toggle';
import './search-controls.scss';

export default function SearchControls() {
    const {sort, setParam} = useWebinarSearchParams();

    return (
        <div className="webinar-search-controls">
            <SortToggle
                sort={sort}
                setSort={(value?: string) => setParam('sort', value)}
                labelId="webinar-sort-label"
            />
        </div>
    );
}
