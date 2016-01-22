let $ = {};

$.toggleClass = function toggleClass(el, name) {
    if (el.classList.contains(name)) {
        el.classList.remove(name);
    } else {
        el.classList.add(name);
    }
};

export default $;
