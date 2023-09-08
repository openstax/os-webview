export type SubjectData = {
    icon: string;
    categories: Array<string>;
}

type Subjects = {
    [key: string]: SubjectData;
}

type ContextValues = {
    subjects: Subjects;
}

export default function useContext(): ContextValues;
