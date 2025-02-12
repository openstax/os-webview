export type AccountsUserModel = {
    id: number;
    uuid: string;
    first_name: string;
    last_name: string;
    email: string;
    school_name: string;
    self_reported_role: string;
    self_reported_school: string;
    is_not_gdpr_location: boolean;
    salesforce_contact_id: string;
    is_instructor_verification_stale: boolean;
    faculty_status: string;
    contact_infos: {
        type: string;
        value: string;
        is_verified: boolean;
        is_guessed_preferred: boolean;
    }[];
};
