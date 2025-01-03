import React from 'react';
import buildContext from '~/components/jsx-helpers/build-context';
import {useUserModel, UserModelType} from '~/models/usermodel';
import useMyOpenStaxUser from '~/models/myopenstax-user';
import {useRefreshable} from '~/helpers/data';
import debounce from 'lodash/debounce';

const debouncedDebug = debounce((...args) => console.debug(...args), 100);

function checkUserForProblems(user?: UserModelType) {
    if (!user || Reflect.ownKeys(user).length === 0) {
        debouncedDebug('No user info retrieved');
    } else if (!('pending_verification' in user)) {
        debouncedDebug('No pending_verification flag set in user info', user);
    } else {
        debouncedDebug('User info:', {
            email: user.email,
            pendingVerification: user.pending_verification,
            groups: user.groups
        });
    }
}

export type UserStatus = ReturnType<typeof getUserStatus>;

// eslint-disable-next-line complexity
function getUserStatus(user: Partial<UserModelType> = {}) {
    const isInstructor =
        user.username && 'groups' in user && user.groups?.includes('Faculty');
    const isStudent = user.username && !isInstructor;
    const trackDownloads =
        user.accountsModel?.faculty_status === 'confirmed_faculty';

    checkUserForProblems();
    return {
        isInstructor,
        isStudent,
        pendingVerification: user.pending_verification,
        firstName: user.first_name,
        lastName: user.last_name,
        email: user.email,
        userInfo: user,
        school: user.accountsModel?.school_name,
        uuid: user.uuid,
        trackDownloads
    };
}

function useContextValue() {
    const model = useUserModel();
    const userStatus = React.useMemo(() => getUserStatus(model), [model]);
    const isVerified =
        model?.accountsModel?.faculty_status === 'confirmed_faculty';
    const [fetchTime, updateMyOpenStaxUser] = useRefreshable(() => Date.now());
    const myOpenStaxUser = useMyOpenStaxUser(isVerified, fetchTime);
    const value = React.useMemo(
        () =>
            model?.last_name
                ? {
                      accountId: model.id,
                      userName: `${model.first_name} ${model.last_name.substr(
                          0,
                          1
                      )}.`,
                      userModel: model,
                      uuid: model.uuid,
                      isVerified,
                      userStatus,
                      myOpenStaxUser,
                      updateMyOpenStaxUser
                  }
                : {userStatus, myOpenStaxUser},
        [model, userStatus, isVerified, myOpenStaxUser, updateMyOpenStaxUser]
    );

    React.useEffect(() => {
        const w = window as typeof window & {
            pi(k: string, id: number): void;
        };

        if (model && model.id) {
            w.pi('identify_client', model.id);
        }
    }, [model]);

    return value;
}

const {useContext, ContextProvider} = buildContext({useContextValue});

export {useContext as default, ContextProvider as UserContextProvider};
