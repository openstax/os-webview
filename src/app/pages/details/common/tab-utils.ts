export function findSelectedTab(labels: string[]) {
    const possibleTabs = Array.from(new window.URLSearchParams(window.location.search).keys());

    return labels.find((label) => possibleTabs.includes(label)) || labels[0];
}

export function replaceSearchTerm(labels: string[], newValue: string) {
    const possibleTabs = Array.from(new window.URLSearchParams(window.location.search).keys());
    const index = possibleTabs.findIndex((t) => labels.includes(t));

    if (index < 0) {
        possibleTabs.unshift(encodeURIComponent(newValue));
    } else {
        possibleTabs[index] = encodeURIComponent(newValue);
    }
    return `?${possibleTabs.join('&')}`;
}
