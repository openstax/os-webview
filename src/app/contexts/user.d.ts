import type {UserModelType} from '~models/usermodel';

type UserType = {
    id?: number;
    username: string;
    groups: string[];
    accounts_id: string;
};

export type UserStatus = {
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
}

type UserContextType = {
    userStatus?: UserStatus;
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
