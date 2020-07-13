import analytics from '~/helpers/analytics';

const fireAt = [
    [0, '0-10 seconds', '0-10 seconds'],
    [11, '11-30 seconds', '11-30 seconds'],
    [31, '31 sec - 1 min', '31-60 seconds'],
    [61, '1-2 minutes', '61-120 seconds'],
    [121, '2-3 minutes', '121-180 seconds'],
    [181, '3-4 minutes', '181-240 seconds'],
    [241, '4-5 minutes', '241-300 seconds'],
    [301, '5-10 minutes', '301-600 seconds'],
    [601, '10-30 minutes', '601-1800 seconds'],
    [1801, 'over 30 min', '1801+ seconds']
];
const action = 'time spent';
const timersRunning = [];

function clearTimers() {
    timersRunning.forEach((timer) => clearTimeout(timer));
}

function setTimers() {
    clearTimers();
    fireAt.forEach(([sec, category, label], i) => {
        timersRunning.push(
            setTimeout(() => {
                analytics.sendPageEvent(`TimeOnPage ${category}`, action, label);
            }, sec * 1000)
        );
    });
}

export default {
    start: setTimers,
    clear: clearTimers
};
