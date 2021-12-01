import React from 'react';
import {useUserModel} from '~/models/usermodel';

const UserContext = React.createContext();

export default UserContext;

export function UserContextProvider({children}) {
    const userModel = useUserModel();
    const value = {
        accountId: userModel?.id,
        accountUUID: userModel?.uuid,
        userName: userModel?.last_name &&
            `${userModel.first_name} ${userModel.last_name.substr(0, 1)}.`
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
