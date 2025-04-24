import { POST, GET } from './api-req'
import { CreateMessageDto } from './dto/CreateMessage.dto'

const API = 'message'

export const createCampaign = async (campaign: CreateMessageDto) => {
    try {
        const response = await POST(API, campaign)

        return response
    } catch (error) {
        throw new Error('Failed to create new campaign')
    }
}