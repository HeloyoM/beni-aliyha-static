import { POST, GET, DELETE } from './api-req'
import { CreateGuestMessageDto } from './dto/CreateGuestMessage.dto'
import { CreateMessageDto } from './dto/CreateMessage.dto'
import { ReplyDto } from './dto/Reply.dto'

const API = 'messages'

export const postMessage = async (msg: CreateMessageDto) => {
    try {
        const response = await POST(API, msg)

        return response
    } catch (error) {
        throw new Error('Failed to create new message')
    }
}

export const postGuestMessage = async (msg: CreateGuestMessageDto) => {
    try {
        const response = await POST(`${API}/guest`, msg)

        return response
    } catch (error) {
        throw new Error('Failed to send message')
    }
}

export const getMessages = async () => {
    try {
        const response = await GET(API)

        return response
    } catch (error) {
        throw new Error('Failed to get messages')
    }
}

export const getGuestMessages = async () => {
    try {
        const response = await GET(`${API}/guest`)

        return response
    } catch (error) {
        throw new Error('Failed to get messages')
    }
}

export const replyToMessage = async (payload: ReplyDto) => {
    try {
        const response = await POST(`${API}/${payload.messageId}/replies`, payload)

        return response
    } catch (error) {
        throw new Error(`Failed to add relpy to message id: ${payload.messageId}`)
    }
}

export const deleteGuestMessage = async (id: string) => {
    try {
        const response = await DELETE(`${API}/guest/${id}`);

        return response;
    } catch (error) {
        throw new Error(`Failed to delete guest message to message id: ${id}`)
    }
}