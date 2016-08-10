const comingSoon = [
    'American Government',
    'Astronomy',
    'Elementary Algebra',
    'Intermediate Algebra',
    'Microbiology',
    {
        text: 'University Physics',
        value: 'University Physics (Calc)'
    }
];

export const published = [
    'Algebra and Trigonometry',
    'Anatomy & Physiology',
    'Biology',
    'Calculus',
    'Chemistry',
    'Chemistry: Atoms First',
    'College Algebra',
    {
        text: 'College Physics',
        value: 'College Physics (Algebra)'
    },
    {
        text: 'College Physics for AP® Courses',
        value: 'AP Physics'
    },
    {
        text: 'Concepts of Biology',
        value: 'Concepts of Bio (non-majors)'
    },
    'Introduction to Sociology',
    {
        text: 'Introduction to Sociology 2e',
        value: 'Introduction to Sociology'
    },
    'Introductory Statistics',
    {
        text: 'Prealgebra',
        value: 'PreAlgebra'
    },
    {
        text: 'Precalculus',
        value: 'Precalc'
    },
    {
        text: 'Principles of Economics',
        value: 'Economics'
    },
    {
        text: 'Principles of Macroeconomics',
        value: 'Macro Econ'
    },
    {
        text: 'Principles of Macroeconomics for AP® Courses',
        value: 'AP Macro Econ'
    },
    {
        text: 'Principles of Microeconomics',
        value: 'Micro Econ'
    },
    {
        text: 'Principles of Microeconomics for AP® Courses',
        value: 'AP Micro Econ'
    },
    'Psychology',
    {
        text: 'U.S. History',
        value: 'US History'
    }
];

const bookTitles = [...comingSoon, ...published].sort((a, b) => {
    const aText = a.text || a;
    const bText = b.text || b;

    return aText < bText ? -1 : aText !== bText;
});

export default bookTitles;
