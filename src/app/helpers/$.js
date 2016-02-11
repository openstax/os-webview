let $ = {};

$.setAttr = (node, name, value) => {
    if (value === false || value === null) {
        node.removeAttribute(name);
    } else {
        node.setAttribute(name, value === true ? '' : value);
    }
};

export default $;
