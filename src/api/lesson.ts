import { POST, GET } from './api-req'

const API = 'lesson'

export const getLessons = async () => {
    try {
        const response = await GET(API)

        return response
    } catch (error) {
        throw new Error('Failed to fetch lessons')
    }
}
