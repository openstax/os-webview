import sfApiFetch from './sfapi';

export type Audience =
    | 'anonymous'
    | 'student'
    | 'instructor'
    | 'instructor_pending'
    | 'admin'
    | 'other';

export type Personalization = {
    v: 1;
    logged_in: boolean;
    audience: Audience;
    segments: string[];
    first_name: string | null;
    school: {
        id: string;
        name: string;
        type: string | null;
        assignable_stage: string | null;
    } | null;
    adoption: {
        state: 'none' | 'current' | 'renewal_due' | 'lapsed';
        base_year: number;
        last_confirmed_base_year: number | null;
        books: string[];
    } | null;
    assignable: {
        user: boolean | null;
        school_integrated: boolean | null;
        school_integration_possible: boolean | null;
    } | null;
    generated_at: string;
};

// Only these fields may be written to storage. Names, school and books stay in memory.
export type StoredPersonalization = Pick<
    Personalization,
    'v' | 'audience' | 'segments'
>;

type StoredEntry = StoredPersonalization & {uuid: string; savedAt: number};

const STORAGE_KEY = 'personalization';
const TTL_MS = 10 * 60 * 1000;

function isPersonalization(payload: unknown): payload is Personalization {
    const candidate = payload as Partial<Personalization> | null;

    return candidate?.v === 1 && Array.isArray(candidate.segments);
}

let cached: {uuid: string; promise: Promise<Personalization>} | undefined;

export function clearPersonalizationCache() {
    cached = undefined;
}

// One request per page load, shared by every consumer; a different uuid refetches.
export function loadPersonalization(uuid: string) {
    if (cached?.uuid !== uuid) {
        const promise = sfApiFetch('personalization', '', {
            withCredentials: true
        }).then((payload) => {
            if (!isPersonalization(payload)) {
                throw new Error('Unusable personalization response');
            }
            return payload;
        });

        cached = {uuid, promise};
    }
    return cached.promise;
}

function isFreshEntry(entry: Partial<StoredEntry> | null, uuid: string) {
    return (
        entry?.uuid === uuid &&
        entry.v === 1 &&
        Array.isArray(entry.segments) &&
        typeof entry.savedAt === 'number' &&
        Date.now() - entry.savedAt < TTL_MS
    );
}

export function readStoredPersonalization(
    uuid: string
): StoredPersonalization | undefined {
    try {
        const raw = sessionStorage.getItem(STORAGE_KEY);
        const entry = raw ? (JSON.parse(raw) as Partial<StoredEntry>) : null;

        if (entry && isFreshEntry(entry, uuid)) {
            return {
                v: 1,
                audience: entry.audience as Audience,
                segments: entry.segments as string[]
            };
        }
    } catch {
        return undefined;
    }
    return undefined;
}

export function storePersonalization(uuid: string, data: Personalization) {
    const entry: StoredEntry = {
        uuid,
        audience: data.audience,
        segments: data.segments,
        v: data.v,
        savedAt: Date.now()
    };

    try {
        sessionStorage.setItem(STORAGE_KEY, JSON.stringify(entry));
    } catch {
        // Storage is only a first-paint optimization
    }
}
