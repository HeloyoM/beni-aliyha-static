import { POST, GET, PUT } from './api-req'
import CreatePaymentDto from './dto/CreatePayment.dto'
import UpdatePaymentStatusDto from './dto/UpdatePaymentStatus.dto'

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

export const createPayment = async (payment: CreatePaymentDto) => {
    try {
        const response = await POST(API, payment)

        return response
    } catch (error) {
        throw new Error(`Failed to fetch all user's payments`)
    }
}

export const updatePaymentStatus = async (payload: UpdatePaymentStatusDto) => {
    try {
        const response = await PUT(`${API}/${payload.id}`, { status: payload.status })

        return response
    } catch (error) {
        throw new Error(`Failed to fetch all user's payments`)
    }
}