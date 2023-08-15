import React from 'react';
import {useLocation} from 'react-router-dom';

// Two Give link options for each of: PDF downloads, Instructor resources, Student resources
export default function useGiveLinks() {
    const {search} = useLocation();

    return React.useMemo(() => getLinks(search), [search]);
}

function getLinks(search: string) {
    if (search.includes('Instructor')) {
        return [
            'https://riceconnect.rice.edu/donation/support-openstax-instructor-resources',
            'https://riceconnect.rice.edu/donation/support-openstax-instructor-resources-b'
        ];
    }
    if (search.includes('Student')) {
        return [
            'https://riceconnect.rice.edu/donation/support-openstax-student-resources',
            'https://riceconnect.rice.edu/donation/support-openstax-student-resources-b'
        ];
    }
    return [
        'https://riceconnect.rice.edu/donation/support-openstax-subject',
        'https://riceconnect.rice.edu/donation/support-openstax-subject-b'
    ];
}
