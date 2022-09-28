import React from 'react';

export function formatDateForBlog(date) {
    if (!date) {
        return null;
    }
    const d = new Date(date).toUTCString().split(' ');

    return `${d[2]} ${d[1]}, ${d[3]}`;
}

export function useToggle(initialState) {
    return React.useReducer((state, newValue=!state) => newValue, initialState);
}

// Returns [value, refresh]
export function useRefreshable(getter) {
    return React.useReducer(getter, getter());
}

// Returns [value, updateValue]
export function useSettable(getter, setter) {
    return React.useReducer(
        (_, payload) => {
            setter(payload);
            return getter();
        },
        getter()
    );
}

// Each time the Set is updated, the handle is refreshed
// That way, the Set doesn't have to be rebuilt
export function useSet(initialValue=[]) {
    const {current: set} = React.useRef(new window.Set(initialValue));
    const [handle, refresh] = useRefreshable(
        () => ({
            add(newValue) {
                set.add(newValue);
                refresh();
            },
            delete(oldValue) {
                set.delete(oldValue);
                refresh();
            },
            has: (v) => set.has(v),
            values: () => set.values()
        })
    );

    return handle;
}

export function htmlToText(html) {
    const temp = document.createElement('div');

    temp.innerHTML = html;
    return temp.textContent;
}
