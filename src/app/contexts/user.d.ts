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
        trackDownloads: boolean;
    };
    userModel?: UserModelType;
    isVerified: boolean;
};

type ProviderArgs = React.PropsWithChildren<{
    contextValueParameters?: unknown;
}>;

export default function useUserContext(): UserContextType;
export function UserContextProvider({
    children,
    contextValueParameters
}: ProviderArgs): React.JSX.Element | null;
