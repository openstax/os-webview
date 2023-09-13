export type Category = {
    value: string;
    cms: string;
    html: string;
    title: string;
    icon: string;
    color: string;
};

type ContextValues = Array<Category>;

export default function useContext(): ContextValues;
