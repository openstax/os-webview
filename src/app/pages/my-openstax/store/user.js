import sfApiFetch from './sfapi';

export function sfSchoolToInstitution(school) {
    return ({
        id: school.salesforce_id,
        name: school.name
    });
}

// There is no direct data source for Institutions. The list should include:
// 1. The school in the Contact
// 2. All schools in opportunities
// 3. Any others that are explicitly added
function institutionEditor() {
    let data = [];

    function values() {
        return [...data];
    }

    function save(scratchValues) {
        data = [...scratchValues];
    }

    async function refresh(contactInfo) {
        const idsAlreadyThere = data.map((v) => v.id);
        const idsToCheck = [
            contactInfo.school_id
            // Also need ids from Opportunities
        ];
        const promises = idsToCheck
            .filter((id) => !idsAlreadyThere.includes(id))
            .map((id) => sfApiFetch('schools', `/${id}`));
        const schools = await (Promise.all(promises));

        for (const s of schools) {
            data.push(sfSchoolToInstitution(s));
        }
    }

    return {values, refresh, save};
}

const institutions = institutionEditor();

async function initializeUser(store) {
    const user = await sfApiFetch('users');

    await institutions.refresh(user.contact);
    store.dispatch('user/update');
}

export default function (store) {
    const INITIAL_STATE = {
        user: {
            institutions: [],
            scratchInstitutions: []
        }
    };

    store.on('@init', () => {
        initializeUser(store);
        return INITIAL_STATE;
    });

    store.on('user/update', () => ({
        user: { institutions: institutions.values() }
    }));

    store.on('user/save', (oldState, newInfo) => {
        institutions.save(Array.from(newInfo).map(sfSchoolToInstitution));
        return {
            user: { institutions: institutions.values() }
        };
    });
}
