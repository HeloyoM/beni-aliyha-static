import axios from 'axios'
import baseUrl from './base-url'
import { handleAxiosError } from '../utils/handleAxiosError';

export const POST = async <T>(url: string, body: unknown) => {
	const config = getRequestConfiguration();

	try {
		return await axios.post<T>(`${baseUrl}/${url}`, body, config);
	} catch (error) {
		handleAxiosError(error);
		throw error;
	}
}

export const PUT = async <T>(url: string, body?: unknown) => {
	const config = getRequestConfiguration();

	try {
		return await axios.put<T>(`${baseUrl}/${url}`, body, config)
	} catch (error) {
		console.log({ error })
		handleAxiosError(error);
		throw error;
	}
}

export const GET = async <T>(url: string) => {
	const config = getRequestConfiguration();

	try {
		return await axios.get<T>(`${baseUrl}/${url}`, config)
	} catch (error) {
		handleAxiosError(error);
		throw error;
	}
}

export const PATCH = async <T>(url: string, body?: unknown) => {
	const config = getRequestConfiguration();

	try {
		return await axios.patch<T>(`${baseUrl}/${url}`, body, config)
	} catch (error) {
		handleAxiosError(error);
		throw error;
	}
}

export const DELETE = async <T>(url: string) => {
	const config = getRequestConfiguration();

	try {
		return await axios.delete<T>(`${baseUrl}/${url}`, config)
	} catch (error) {
		handleAxiosError(error);
		throw error;
	}
}

const getRequestConfiguration = () => {
	// const timeout = 60_000; // equal to 1 minute
	const token = localStorage.getItem('token');
	// const token = tokenAccess ? 'Bearer tokenAccess' : null
	// const { token: cancelToken } = axios.CancelToken.source()
	const headers = token ? { Authorization: `Bearer ${token}` } : { Authorization: null }

	return {
		headers,
		// timeout,
		// cancelToken
	}
}
