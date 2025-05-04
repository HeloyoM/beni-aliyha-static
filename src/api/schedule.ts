import { POST, GET, PATCH } from './api-req'
import { CreateScheduleDto } from './dto/CreateSchedule.dto'

interface Times {
    mincha_time?: string
    shacharis_time?: string
    maariv_time?: string
}
const API = 'schedule'

export const insertSchedule = async (schedule: CreateScheduleDto) => {
    try {
        const response = await POST(API, schedule)

        return response
    } catch (error) {
        throw new Error('Failed to create new schedule')
    }
}

export const getSchedules = async () => {
    try {
        const response = await GET(API)

        return response
    } catch (error) {
        throw new Error('Failed to fetch shule schedules')
    }
}