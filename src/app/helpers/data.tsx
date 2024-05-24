import React from 'react';

export function formatDateForBlog(date: string) {
    if (!date) {
        return null;
    }
    const d = new Date(date).toUTCString().split(' ');

    return `${d[2]} ${d[1]}, ${d[3]}`;
}

export function useToggle(initialState = false): [boolean, (v?: boolean) => void] {
    return React.useReducer((state, newValue = !state) => newValue, initialState);
}

// Returns [value, refresh]
export function useRefreshable<T>(getter: () => T) {
    return React.useReducer(getter, getter());
}

// Each time the Set is updated, the handle is refreshed
// That way, the Set doesn't have to be rebuilt
export function useSet<T>(initialValue:T[]=[]) {
    const {current: set} = React.useRef(new window.Set(initialValue));
    const [handle, refresh] = useRefreshable(
        () => ({
            add(newValue: T) {
                set.add(newValue);
                refresh();
            },
            delete(oldValue: T) {
                set.delete(oldValue);
                refresh();
            },
            has: (v: T) => set.has(v),
            values: () => set.values()
        })
    );

    return handle;
}

export function htmlToText(html: string) {
    const temp = document.createElement('div');

    temp.innerHTML = html;
    return temp.textContent;
}
