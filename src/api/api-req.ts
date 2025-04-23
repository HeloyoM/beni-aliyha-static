import axios from 'axios'
import baseUrl from './base-url'
import { getItem } from '../utils/localStorage'

export const POST = async <T>(url: string, body: unknown) => {
	const config = getRequestConfiguration();

	return await axios.post<T>(`${baseUrl}/${url}`, body, config)
}

export const PUT = async <T>(url: string, body?: unknown) => {
	const config = getRequestConfiguration();
	return await axios.put<T>(`${baseUrl}/${url}`, body, config)

}

export const GET = async <T>(url: string) => {
	console.log(`${baseUrl}/${url}`)
	const config = getRequestConfiguration();
console.log({config})
	return await axios.get<T>(`${baseUrl}/${url}`, config)
}

export const PATCH = async <T>(url: string, body?: unknown) => {
	const config = getRequestConfiguration();

	return await axios.patch<T>(`${baseUrl}/${url}`, body, config)

}

export const DELETE = async <T>(url: string) => {
	const config = getRequestConfiguration();

	return await axios.delete<T>(`${baseUrl}/${url}`, config)
}

const getRequestConfiguration = () => {
	// const timeout = 60_000; // equal to 1 minute
	const token = localStorage.getItem('token');
	console.log({ token })
	// const token = tokenAccess ? 'Bearer tokenAccess' : null
	// const { token: cancelToken } = axios.CancelToken.source()
	const headers = token ? { Authorization: `Bearer ${token}` } : { Authorization: null }

	return {
		headers,
		// timeout,
		// cancelToken
	}
}
