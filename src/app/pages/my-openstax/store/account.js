const accountsUserAPI = 'https://accounts-dev.openstax.org/api/user';

function transformData(data) {
    return {
        accountsId: data.id,
        firstName: data.first_name,
        lastName: data.last_name,
        username: data.username,
        emails: data.contact_infos.filter((info) => info.type === 'EmailAddress')
            .map((info) => ({
                address: info.value,
                verified: info.is_verified,
                primary: info.is_guessed_preferred
            }))
    };
}

function loadData() {
    return fetch(`${accountsUserAPI}`, { credentials: 'include' })
        .then(
            (response) => response.json(),
            (err) => {
                console.warn('Accounts fetch error:', err);
            }
        )
        .then((result) => {
            return transformData(result);
        });
}

export default function (store) {
    function refreshData(data) {
        return store.dispatch('account/loaded', data);
    }
    const NOT_READY = {
        account: {
            ready: false
        }
    };

    store.on('@init', () => {
        loadData().then(refreshData);
        return NOT_READY;
    });
    store.on('account/loaded', (_, data) => {
        return {
            account: Object.assign(
                {
                    ready: true
                },
                data
            )
        };
    });
}
