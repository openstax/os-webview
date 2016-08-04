const formatDateForBlog = (date) => {
    const d = new Date(date).toUTCString().split(' ');

    return `${d[2]} ${d[1]}, ${d[3]}`;
};

const shuffle = (array) => {
    let currentIndex = array.length;

    while (currentIndex > 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        const temporaryValue = array[randomIndex];

        currentIndex -= 1;
        array[randomIndex] = array[currentIndex];
        array[currentIndex] = temporaryValue;
    }

    return array;
};

export {
    formatDateForBlog,
    shuffle
};
