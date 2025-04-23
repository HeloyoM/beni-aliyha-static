import { GET, POST } from "./api-req"
import { LoginDto } from "./dto/Login.dto"
import { RegisterDto } from "./dto/Register.dto"
import { UpdatePasswordDto } from "./dto/UpdatePassword.dto"

const API = 'auth'

export const profile = async () => {
    try {
        const response = await GET(`${API}/profile`)

        return response
    } catch (error) {
        throw new Error('Failed to get profile')
    }
}

export const login = async (payload: LoginDto) => {
    try {
        const response = await POST(`${API}/login`, payload)

        return response
    } catch (error) {
        throw new Error('Failed to login')
    }
}
    
export const register = async (payload: RegisterDto) => {
    try {
        const response = await POST(`${API}/register`, payload)

        return response
    } catch (error) {
        throw new Error('Failed to register')
    }
}

export const updatePassword = async (payload: UpdatePasswordDto) => {
    try {
        const response = await POST(`${API}/reset-password`, payload)

        return response
    } catch (error) {
        throw new Error('Failed to register')
    }
}
    
export const logout = async () => {
    try {
        const response = await POST(`${API}/logout`, {})

        return response
    } catch (error) {
        throw new Error('Failed to logout')
    }
}