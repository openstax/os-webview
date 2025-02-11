import React from 'react';
import DropdownSelect from '~/components/select/drop-down/drop-down';

const now = new Date();
const previousAcademicYear = now.getFullYear() - (now.getMonth() < 7 ? 2 : 1);

export default function YearSelector({
    selectedYear = (previousAcademicYear + 1).toString(),
    onValueUpdate
}: {
    selectedYear?: string;
    onValueUpdate?: (value: string) => void;
}) {
    const yearOptions = React.useMemo(
        () =>
            [0, 1, 2]
                .map((plusYears) => previousAcademicYear + plusYears)
                .map((startYear) => ({
                    label: `${startYear}-${startYear + 1}`,
                    value: startYear.toString(),
                    selected: selectedYear === startYear.toString()
                })),
        [selectedYear]
    );

    return (
        <label className="year-selector">
            I am reporting usage of OpenStax books for the
            <DropdownSelect
                name="baseYear"
                options={yearOptions}
                required
                onValueUpdate={onValueUpdate}
            />
            school year
        </label>
    );
}
