import $ from '~/helpers/$';

let scrollPromise;

function resetScrollTo() {
    scrollPromise = new Promise((resolve) => {
        $.scrollTo = function (el) {
            resolve(el);
            return scrollPromise;
        };
    });
}

resetScrollTo();
export default scrollPromise;
