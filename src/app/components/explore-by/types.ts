export type Category = {
    id: number;
    name: string;
    subjectIcon?: string;
};

export type Collection = {
    id: string;
    name: string;
    collectionImage?: string;
};

export type ExploreItem = Category | Collection;

export function isCategory(item: ExploreItem): item is Category {
    return 'subjectIcon' in item;
}

export function isCollection(item: ExploreItem): item is Collection {
    return 'collectionImage' in item;
}
