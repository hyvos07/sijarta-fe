import { User, Convert } from '../types/user';
import userJson from '../mocks/user.json';

export const userService = {
    getAllUser: async (): Promise<User[]> => {
        const jsonString = JSON.stringify(userJson);
        return Convert.toUser(jsonString);
    },

    getUserByID: async (id: string): Promise<User | null> => {
        const user = await userService.getAllUser();
        return user.find((u) => u.id === id) || null;
    },

    getUserByPhone: async (noHP: string): Promise<User | null> => {
        const user = await userService.getAllUser();
        return user.find((u) => u.noHP === noHP) || null;
    }
};