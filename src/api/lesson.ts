import { POST, GET } from './api-req'
import { CreateLessonDto } from './dto/CreateLesson.dto'

const API = 'lesson'

export const getLessons = async () => {
    try {
        const response = await GET(API)

        return response
    } catch (error) {
        throw new Error('Failed to fetch lessons')
    }
}

export const createLesson = async (lesson: Partial<CreateLessonDto>) => {
    try {
        const response = await POST(API, lesson)

        return response
    } catch (error) {
        throw new Error('Failed to create lesson')
    }
}
