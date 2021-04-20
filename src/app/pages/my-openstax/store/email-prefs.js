const genUpdates = ['OpenStax newsletter', 'Updates about my books'];
const subjectUpdates = ['Math', 'Science', 'Social Science', 'Humanities',
    'Business', 'Essentials', 'College Success', 'High School'];

async function loadData() {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            resolve({
                general: genUpdates.map((label) => ({
                    label,
                    selected: false
                })),
                subjectUpdates: subjectUpdates.map((label) => ({
                    label,
                    selected: false
                }))
            });
        }, 350);
    });
}

async function saveData(item) {
    return new Promise((resolve) => {
        window.setTimeout(() => {
            item.saved = Date.now();
            resolve(true);
        }, 350);
    });
}

export default function (store) {
    const INITIAL_STATE = {
        emailPrefs: {
            general: [],
            subjectUpdates: []
        }
    };

    store.on('@init', () => {
        loadData().then((data) => store.dispatch('emailPrefs/loaded', data));
        return INITIAL_STATE;
    });
    store.on('emailPrefs/loaded', (_, data) => {
        return {
            emailPrefs: data
        };
    });
    store.on('emailPrefs/notify', (_) => {
        return {
            emailPrefs: _.emailPrefs
        };
    });
    store.on('emailPrefs/update', (_, { item, selected }) => {
        item.selected = selected;
        store.dispatch('emailPrefs/save', item);
    });
    store.on('emailPrefs/save', (_, item) => {
        saveData(item).then(() => {
            store.dispatch('emailPrefs/notify');
        });
        store.dispatch('emailPrefs/notify');
    });
}
