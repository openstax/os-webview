import adoptionPromise, {AdoptionData} from '~/models/adoption-info';

const asUSD = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
});

function createThanksStatement({adoptions}: AdoptionData) {
    if (!adoptions) {
        return null;
    }
    const firstYear = Math.min(...adoptions.map((a) => a.baseYear));
    const sumStudents = adoptions
        .map((a) => a.students)
        .filter((s): s is Exclude<typeof s, null> => s !== null)
        .reduce((a, b) => a + b);
    const sumSavings = adoptions.map((a) => a.savings).reduce((a, b) => a + b);

    return (
        (firstYear
            ? `Thanks for being an adopter of our books since ${firstYear}. `
            : '') +
        (sumSavings
            ? `You've impacted ${sumStudents} students, saving them a total of
    ${asUSD.format(sumSavings)}.`
            : '')
    );
}

export default adoptionPromise.then(createThanksStatement);
