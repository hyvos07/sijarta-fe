import { cookies } from 'next/headers';
import { decrypt } from '../cipher';
import { userService } from '../../db/services/user';

export const getUser = async () => {
    const authToken = (await cookies()).get("auth-token")?.value;
    if (!authToken) {a
        throw new Error("No auth token found");
    }

    const userId = decrypt(authToken).slice(-36);
    const user = await userService.getUserByID(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};