import React from 'react';
import {Link, useNavigate, useLocation} from 'react-router-dom';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faChevronLeft} from '@fortawesome/free-solid-svg-icons/faChevronLeft';
import './breadcrumb.scss';

type BreadcrumbArgs = {
    name: string;
};

export default function Breadcrumb({name}: BreadcrumbArgs) {
    const {pathname} = useLocation();
    // Remove everything after the first slash that follows a character
    const topLevel = pathname.replace(/(?<=.)\/.*/, '');
    const goBack = useGoBack(topLevel);

    return (
        <Link to={topLevel} onClick={goBack} className='breadcrumb'>
            <FontAwesomeIcon icon={faChevronLeft} />
            <span>Back to Main {name}</span>
        </Link>
    );
}

function useGoBack(path: string) {
    const navigate = useNavigate();
    const {state} = useLocation();

    return React.useCallback(
        (e: React.MouseEvent<HTMLAnchorElement>) => {
            if (state?.from === path) {
                navigate(-1);
            } else {
                navigate(path, {replace: true});
            }
            e.preventDefault();
        },
        [navigate, path, state?.from]
    );
}
