import type { AccountsUserModel } from './accounts';

declare global {
    interface Window {
        _OX_USER_PROMISE?: Promise<AccountsUserModel>;
        dataLayer?: object[];
    }
}
