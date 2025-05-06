import { POST, GET } from './api-req'

const API = 'payments'

export const getPayments = async () => {
    try {
        const response = await GET(API)

        return response
    } catch (error) {
        throw new Error('Failed to fetch payments')
    }
}

export const getAllPayments = async () => {
    try {
        const response = await GET(`${API}/all`)

        return response
    } catch (error) {
        throw new Error(`Failed to fetch all user's payments`)
    }
}