import { GET, POST, PUT } from "./api-req";

const API = 'admin';

export const toggleActivationUser = async (user_ids: string[]) => {
    try {
        const response = await PUT(`${API}/users/activation`, { user_ids });

        return response;
    } catch (error) {   
        throw new Error('Failed to patch user/s');
    }
}