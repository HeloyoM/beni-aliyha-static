import { GET, POST } from "./api-req";
import { UpdateProfileDto } from "./dto/UpdateProfile.dto";

const API = 'user'

export const updateProfile = async (payload: UpdateProfileDto) => {
    try {
        const response = await POST(`${API}/update-profile`, payload)

        return response
    } catch (error) {
        throw new Error('Failed to update profile')
    }
}