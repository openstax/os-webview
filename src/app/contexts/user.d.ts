// Until I translate the entire user.js file, this one will have the types

import {UserModelType} from '~models/usermodel-types';

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
