import useDetailsContext from '~/pages/details/context';
import useBookImpact from '~/models/book-impact';

function plugInto(container: Element, id: string, value: string) {
    const el = container.querySelector(`#${id}`);

    if (el) {
        el.textContent = value;
    }
}

export default function useSavingsData() {
    const {supportStatement: description, salesforceName} =
        useDetailsContext();
    const impact = useBookImpact(salesforceName);

    if (!impact) {
        return null;
    }
    const numFormat = window.Intl.NumberFormat('en-US').format; // eslint-disable-line new-cap
    const el = document.createElement('div');

    el.innerHTML = description.trim();
    plugInto(el, 'adoption_number', numFormat(impact.adoptions));
    plugInto(el, 'savings', numFormat(Math.round(impact.savings)));
    return el.innerHTML;
}
