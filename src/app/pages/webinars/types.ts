export type PageData = {
    title?: string;
    heading?: string;
};

type BooleanString = 'True' | 'False';

type SubjectEntry = {
    subject: string;
    featured: BooleanString;
};

type CollectionEntry = {
    collection: string;
    featured: BooleanString;
    popular: BooleanString;
};

export type Webinar = {
    id: number;
    subjects: SubjectEntry[];
    collections: CollectionEntry[];
    title: string;
    description: string;
    start: Date;
    end: Date;
    registrationLinkText: string;
    registrationUrl: string;
    speakers: string;
};
