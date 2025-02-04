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
    username: string;
    self_reported_role: string;
    self_reported_school: string;
    is_not_gdpr_location: boolean;
    salesforce_contact_id: string;
    accountsModel: {
        id: number;
        faculty_status?: string;
        school_name?: string;
        contact_infos: {
            type: string;
            value: string;
            is_verified: boolean;
            is_guessed_preferred: boolean;
        }[];
        load: () => Promise<UserModelType['accountsModel']>
    };
};

declare const userModel: {
    load(): Promise<UserModelType>;
};

export default userModel;
export const accountsModel: UserModelType['accountsModel'];
export function useUserModel(): UserModelType;
