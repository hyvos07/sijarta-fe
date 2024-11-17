import { userService } from '@/app/db/services/user';
import { decrypt } from '@/app/functions/cipher';

// Function to get the user from the token (which contains the phone number)
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
