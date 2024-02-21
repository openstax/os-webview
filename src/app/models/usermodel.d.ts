export type UserModelType = {
    id: number;
    accounts_id: number;
    uuid: string;
    email?: string;
    first_name: string;
    groups: string[];
    last_name: string;
    instructorEligible: boolean;
    pending_verification: boolean;
    stale_verification: boolean;
    incompleteSignup: boolean;
    pendingInstructorAccess: boolean;
    emailUnverified: boolean;
    is_newflow: boolean; // Obsolete?
    username: string;
    self_reported_role: string;
    self_reported_school: string;
    is_not_gdpr_location: boolean;
    salesforce_contact_id: string;
    accountsModel: object;
};

declare const userModel: {
    load(): Promise<UserModelType>;
};

export default userModel;
