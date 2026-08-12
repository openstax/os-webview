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
    const firstIndex = possibleTabs.findIndex((tab) => lowerLabels.includes(tab.toLowerCase()));
    const filtered = possibleTabs.filter((tab) => !lowerLabels.includes(tab.toLowerCase()));

    if (firstIndex < 0) {
        filtered.unshift(newValue);
    } else {
        filtered.splice(firstIndex, 0, newValue);
    }
    return `?${filtered.map((tab) => encodeURIComponent(tab)).join('&')}`;
}
