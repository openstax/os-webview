import type {UserModelType} from '~models/usermodel';

type UserType = {
    username: string;
    groups: string[];
};

type UserContextType = {
    userStatus?: {
        isInstructor: boolean;
        isStudent: boolean;
        pendingVerification: boolean;
        firstName: string;
        lastName: string;
        email: string;
        userInfo: UserType;
        school: string;
        uuid: string;
    };
    userModel?: UserModelType;
};

export default function useUserContext(): UserContextType;
