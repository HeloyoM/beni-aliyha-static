import { GET, POST } from "./api-req";
import { UpdateProfileDto } from "./dto/UpdateProfile.dto";

const API = 'user';

export const updateProfile = async (payload: UpdateProfileDto) => {
    try {
        const response = await POST(`${API}/update-profile`, payload);

        return response;
    } catch (error) {
        throw new Error('Failed to update profile');
    }
}

export const getAllUsers = async () => {
    try {
        const response = await GET(`${API}/all`);

        return response;
    } catch (error) {
        throw new Error('Failed to fetch all users');
    }
}

export const actionClicked = async (type: string) => {
    try {
        const response = await POST(`${API}/user-actions`, { type });

        return response;
    } catch (error) {
        throw new Error('Failed to fetch all users');
    }
}