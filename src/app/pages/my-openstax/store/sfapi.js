const server = 'https://tutorqa.salesforce.openstax.org'; // 'http://localhost:4004'
//  /api/v1/opportunities/0060v000008WUp1AAG

export async function sfApiPost(objectType, data, method = 'POST') {
    try {
        const options = {
            credentials: 'include',
            method,
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        };
        const raw = await fetch(`${server}/api/v1/${objectType}`, options);
        const text = await raw.json();

        if (!raw.ok) {
            console.warn('Failed with status', raw.status);
            console.warn(text.error);
        }
        return raw;
    } catch (err) {
        console.warn(`Fetch (POST) ${objectType}: ${err}`);
        return null;
    }
}

export default async function sfApiFetch(objectType, specifier = '') {
    try {
        const raw = await fetch(`${server}/api/v1/${objectType}${specifier}`, {
            credentials: 'include',
            mode: 'cors',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
                Cache: 'no-0d4zFOeMPUmfxkCjHocCuoLa2SAGzBI8AREcH3eP3758F672DppA'
            }
        });
        const result = await raw.json();

        return result;
    } catch (err) {
        console.warn(`Fetch ${objectType}: ${err}`);
        return null;
    }
}
