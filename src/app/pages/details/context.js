import {createContext} from 'react';

export default createContext();

export function useContextValue(data) {
    data.comingSoon = data.bookState === 'coming_soon';

    return data;
}
