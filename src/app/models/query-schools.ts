import cmsFetch from '~/helpers/cms-fetch';

export const MAX_SEARCH_RESULTS = 1000;

export type SchoolInfo = {
    name: string;
    physical_city: string;
    physical_state_province: string;
    key_institutional_partner: string;
    type: string;
    long: string;
    lat: string;
    testimonial?: string;
    testimonial_name?: string;
    testimonial_position?: string;
    all_time_savings: number;
    location: string;
    total_school_enrollment: string | null;
};

export function generateCityState(schoolInfo: SchoolInfo) {
    return [schoolInfo.physical_city, schoolInfo.physical_state_province]
        .filter((a) => a)
        .join(', ');
}

type Item = {
    pk: string;
    fields: SchoolInfo;
};

type AugmentedInfo = {
    pk: string;
    cityState: string;
    institutionalPartner: string;
    institutionType: string;
    fields: SchoolInfo;
    lngLat?: number[];
    testimonial?: {
        text: string;
        name?: string;
        position?: string;
    };
};

function augmentInfo(item: Item) {
    const result: AugmentedInfo = {
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

type SearchFields =
    | 'partners'
    | 'savings'
    | 'testimonials'
    | 'institution-type';
const toSearchParam: Record<SearchFields, string> = {
    partners: 'key_institutional_partner',
    savings: 'saved_one_million',
    testimonials: 'testimonial',
    'institution-type': 'type'
};
const emptyResult: never[] & {TOO_MANY?: boolean} = [];

emptyResult.TOO_MANY = true;

function doFetch(searchParameters: string) {
    return cmsFetch(`${searchPath}?${searchParameters}`).then((response) =>
        response.length > MAX_SEARCH_RESULTS
            ? emptyResult
            : response
                  .filter((info: Item) => info.fields.all_time_savings > 0)
                  .map(augmentInfo)
                  .sort((a: AugmentedInfo, b: AugmentedInfo) =>
                      a.fields.name.toLowerCase() < b.fields.name.toLowerCase()
                          ? -1
                          : 1
                  )
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
export default function querySchools(
    queryString: string,
    selectedFilters?: Partial<typeof toSearchParam>
) {
    let searchParameters = `q=${queryString}`;

    if (!selectedFilters) {
        if (queryString.length < 3) {
            return null;
        }
    } else {
        const filterString = (
            Reflect.ownKeys(selectedFilters) as SearchFields[]
        )
            .map((k) => `${toSearchParam[k]}=${selectedFilters[k]}`)
            .join('&');

        searchParameters += `&${filterString}`;
    }

    return doFetch(searchParameters);
}

export function queryById(id: string) {
    return cmsFetch(`${searchPath}?id=${id}`).then((response: Item[]) => {
        return response.length > 0 ? augmentInfo(response[0]) : null;
    });
}
