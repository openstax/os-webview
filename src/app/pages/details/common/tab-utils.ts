export function findSelectedTab(labels: string[]) {
    const possibleTabs = Array.from(new window.URLSearchParams(window.location.search).keys());

    return (
        labels.find((label) =>
            possibleTabs.some((tab) => tab.toLowerCase() === label.toLowerCase())
        ) || labels[0]
    );
}

export function replaceSearchTerm(labels: string[], newValue: string) {
    const lowerLabels = labels.map((label) => label.toLowerCase());
    const possibleTabs = Array.from(new window.URLSearchParams(window.location.search).keys());
    const index = possibleTabs.findIndex((tab) => lowerLabels.includes(tab.toLowerCase()));

    if (index < 0) {
        possibleTabs.unshift(newValue);
    } else {
        possibleTabs[index] = newValue;
    }
    return `?${possibleTabs.map((tab) => encodeURIComponent(tab)).join('&')}`;
}
