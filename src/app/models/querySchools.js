import cmsFetch from './cmsFetch';

const MAX_SEARCH_RESULTS = 1000;

export function generateCityState(schoolInfo) {
    return [schoolInfo.physical_city, schoolInfo.physical_state_province].filter((a) => a).join(', ');
}

function augmentInfo(item) {
    const result = {
        pk: item.pk,
        cityState: generateCityState(item.fields),
        institutionalPartner: item.fields.key_institutional_partner,
        institutionType: item.fields.type,
        fields: item.fields
    };
    const lngLat = [Number(item.fields.long), Number(item.fields.lat)];

    if (!(lngLat[0] === 0 && lngLat[1] === 0)) {
        result.lngLat = lngLat;
    }
    if (item.fields.testimonial) {
        result.testimonial = {
            text: item.fields.testimonial,
            name: item.fields.testimonial_name,
            position: item.fields.testimonial_position
        };
    }

    return result;
}

const searchPath = 'schools/';
const toSearchParam = {
    partners: 'key_institutional_partner',
    savings: 'saved_one_million',
    testimonials: 'testimonial',
    'institution-type': 'type'
};

function doFetch(searchParameters) {
    return cmsFetch(`${searchPath}?${searchParameters}`)
        .then((response) =>
            response.length > MAX_SEARCH_RESULTS ? [] :
                response.map(augmentInfo)
                    .sort((a, b) => a.fields.name.toLowerCase() < b.fields.name.toLowerCase() ? -1 : 1)
        );
}

/**
 * Constructs a query parameter string to for the schools API and makes
 * the call to retrieve it
 *
 * @param {string} queryString - part of a school name, city, etc.
 * @param {object} selectedFilters - dictionary of filter settings
 * @return {Promise}
 */
export default function (queryString, selectedFilters) {
    let searchParameters = `q=${queryString}`;

    if (!selectedFilters) {
        if (queryString.length < 4) {
            return null;
        }
    } else {
        const filterString = Reflect.ownKeys(selectedFilters)
            .map((k) => `${toSearchParam[k]}=${selectedFilters[k]}`)
            .join('&');

        searchParameters += `&${filterString}`;
    }

    return doFetch(searchParameters);
}

export function queryById(id) {
    return cmsFetch(`${searchPath}?id=${id}`)
        .then((response) => augmentInfo(response[0]));
}
