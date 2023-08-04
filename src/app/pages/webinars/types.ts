export type PageData = {
    title?: string;
    heading?: string;
};

type SubjectEntry = {
    subject: string;
    featured: boolean;
};

type CollectionEntry = {
    collection: string;
    featured: boolean;
    popular: boolean;
};

export type Webinar = {
    id: number;
    subjects: SubjectEntry[];
    title: string;
    description: string;
    start: Date;
    end: Date;
    registrationLinkText: string;
    registrationUrl: string;
};
