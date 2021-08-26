import { useStoreon } from 'storeon/preact';
import {useState, useEffect} from 'react';
import {sfApiPost} from './sfapi';
import uniq from 'lodash/uniq';

function useUserSchoolIds() {
    const {user} = useStoreon('user');
    const [data, setData] = useState([]);

    useEffect(() => {
        const {schools} = user;
        const schoolIds = schools ? schools.map((s) => s.schoolId) : [];

        setData({
            primarySchoolId: schools.filter((s) => s.primary).map((s) => s.schoolId)[0],
            schoolIds: uniq(schoolIds)
        });
    }, [user]);

    return data;
}

function saveSchools(contactId, oldSchoolIds, newSchoolIds) {
    /* eslint-disable camelcase */
    const deletePromises = oldSchoolIds.filter((id) => !newSchoolIds.includes(id))
        .map((id) => sfApiPost(
            'contacts/remove_school',
            {contact_id: contactId, school_id: id},
            'DELETE'
        ));
    const insertPromises = newSchoolIds.filter((id) => !oldSchoolIds.includes(id))
        .map((id) => sfApiPost(
            'contacts/add_school',
            {contact_id: contactId, school_id: id}
        ));

    return Promise.all([...deletePromises, ...insertPromises]);
}

function updatePrimary(contactId, schoolId) {
    sfApiPost(
        'contacts/set_primary_school',
        {contact_id: contactId, school_id: schoolId}
    );
}

function useLookedupSchools(ids) {
    const {schools, dispatch} = useStoreon('schools');
    const [data, setData] = useState([]);

    useEffect(() => {
        dispatch('school-lookup/decode', ids);
    }, [ids, dispatch]);

    useEffect(() => {
        setData(ids.map((id) => schools[id]).filter((x) => x));
    }, [ids, schools]);

    return data;
}

// There is no direct data source for Institutions. The list should include:
// 1. The school in the Contact
// 2. All schools in opportunities
// 3. Any others that are explicitly added
export default function useInstitutions() {
    const {primarySchoolId, schoolIds=[]} = useUserSchoolIds();
    const institutions = useLookedupSchools(schoolIds);
    const {user, dispatch} = useStoreon('user');
    const contactId = user && user.contact && user.contact.salesforceId;

    return {
        primarySchoolId,
        institutions,
        save(newSchoolIds) {
            return saveSchools(contactId, schoolIds, newSchoolIds)
                .then(dispatch('user/fetch'));
        },
        setPrimary(id) {
            if (id !== primarySchoolId) {
                updatePrimary(contactId, id);
            }
        }
    };
}
