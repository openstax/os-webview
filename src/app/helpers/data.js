const formatDateForBlog = (date) => {
    const d = new Date(date).toUTCString().split(' ');

    return `${d[2]} ${d[1]}, ${d[3]}`;
};

export {
    formatDateForBlog
};
