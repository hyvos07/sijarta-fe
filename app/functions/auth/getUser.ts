import { cookies } from 'next/headers';
import { decrypt } from '../cipher';
import { userService } from '../../db/services/user';

export const getUser = async () => {
    const authToken = (await cookies()).get("auth-token")?.value;
    if (!authToken) {
        throw new Error("No auth token found");
    }

    const userId = decrypt(authToken).slice(-36);
    const user = await userService.getUserByID(userId);

    if (!user) {
        throw new Error("User not found");
    }

    return user;
};

export async function getUserFromToken(token: string) {
    try {
        // Extract the phone number from the token (since it's generated from the phone number)
        const decryptedToken = decrypt(token);
        const phone = decryptedToken.slice(0, 12); // Assuming phone number is 13 characters long

        // Retrieve the user from the database (or mock data) using the phone number
        const user = await userService.getUserByPhone(phone);
        if (!user) {
            console.error('User not found for token:', decryptedToken);
            console.error(phone);
            return null;
        }
        // Return user object containing the user ID (from mock data)
        return { id: user.id }; // The ID is used for role lookup
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
}