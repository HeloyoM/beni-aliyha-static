import { POST, GET } from './api-req'
import { CreateEventDto } from './dto/CreateEvent.dto'

const API = 'events'

export const getCommunityEvents = async () => {
    try {
        const response = await GET(API);

        return response;
    } catch (error) {
        throw new Error('Failed to fetch community events')
    }
}

export const getEventsTypes = async () => {
    try {
        const response = await GET(`${API}/types`);

        return response;
    } catch (error) {
        throw new Error('Failed to fetch events types')
    }
}

export const createNewEvent = async (newEvent: CreateEventDto) => {
    try {
        const response = await POST(API, newEvent);

        return response;
    } catch (error) {
        throw new Error('Failed to create new event')
    }
}




