export function toggleClass(el, name) {
    if (el.classList.contains(name)) {
        el.classList.remove(name);
    } else {
        el.classList.add(name);
    }
}

export function nodeListAsArray(nodeList) {
    return Reflect.apply([].slice, nodeList, 0);
}
