import { POST, GET } from './api-req'
import { CampaignDto } from './dto/Campaign.dto'

const API = 'campaign'

export const createCampaign = async (campaign: CampaignDto) => {
    try {
        const response = await POST(API, campaign)

        return response
    } catch (error) {
        throw new Error('Failed to create new campaign')
    }
}

export const getCampaigns = async () => {
    try {
        const response = await GET(API)

        return response
    } catch (error) {
        throw new Error('Failed to get campaigns list')
    }
}

export const getCampaignMembers = async (campaignId: string) => {
    try {
        const response = await GET(`${API}/${campaignId}`)

        return response
    } catch (error) {
        throw new Error(`Failed to get campaign's members list`)
    }
}

export const getCampaignTypes = async () => {
    try {
        const response = await GET(`${API}/types`)

        return response
    } catch (error) {
        throw new Error('Failed to create new campaign')
    }
}

export const joinCampaign = async (campaignId: string) => {
    try {
        const response = await POST(`${API}/${campaignId}/members`, {})

        return response
    } catch (error) {
        throw new Error('Failed to join to campaign')
    }
}

