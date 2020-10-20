import analytics from '~/helpers/analytics';

function plugInto(container, id, value) {
    const el = container.querySelector(`#${id}`);

    if (el) {
        el.textContent = value;
    }
}

export default function useSavingsDataIn(description, adoptions, savings) {
    if (!adoptions) {
        return description;
    }
    const numFormat = Intl.NumberFormat('en-US').format; // eslint-disable-line new-cap
    const el = document.createElement('div');

    el.innerHTML = description.trim();
    plugInto(el, 'adoption_number', numFormat(adoptions));
    plugInto(el, 'savings', numFormat(Math.round(+savings)));
    return el.innerHTML;
}

export function linkClickTracker(eventName) {
    return function (event) {
        if (event.target.href) {
            analytics.sendPageEvent(
                eventName,
                'open',
                event.target.href
            );
        }
    };
}
