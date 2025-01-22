import useDetailsContext from '~/pages/details/context';

function plugInto(container: Element, id: string, value: string) {
    const el = container.querySelector(`#${id}`);

    if (el) {
        el.textContent = value;
    }
}

export default function useSavingsData() {
    const {
        supportStatement: description,
        adoptions,
        savings
    } = useDetailsContext();

    if (!adoptions) {
        return description;
    }
    const numFormat = window.Intl.NumberFormat('en-US').format; // eslint-disable-line new-cap
    const el = document.createElement('div');

    el.innerHTML = description?.trim() || '';
    plugInto(el, 'adoption_number', numFormat(adoptions));
    plugInto(el, 'savings', numFormat(Math.round(+savings)));
    return el.innerHTML;
}
