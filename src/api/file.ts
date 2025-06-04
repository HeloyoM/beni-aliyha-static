import { GET, POST } from './api-req'

const API = 'files'

export const uploadFile = async (formData: FormData) => {
    try {
        const response = await POST(`${API}/upload-scp-files`, formData);

        return response;
    } catch (error) {
        throw new Error('Failed to upload files')
    }
}

export const getWeeksScpFiles = async () => {
    try {
        const response = await GET(API, { responseType: 'blob' });

        return response;
    } catch (error) {
        throw new Error('Failed to fetch files')
    }
}