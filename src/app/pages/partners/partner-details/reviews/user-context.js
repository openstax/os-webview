import React, {createContext, useContext} from 'react';
import {useUserModel} from '~/models/usermodel';

const UserContext = createContext();

export default UserContext;

export function UserContextProvider({children}) {
    const userModel = useUserModel();
    const value = {
        accountId: userModel && userModel.id,
        userName: userModel && userModel.last_name &&
            `${userModel.first_name} ${userModel.last_name.substr(0, 1)}.`
    };

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
}
