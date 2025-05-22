import Paths from "../enum/Paths.enum";
import * as axios from 'axios';

export const handleAxiosError = (error) => {
    if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || 'Something went wrong';
        console.error('Axios error:', message);

        // you can also redirect or show toast here
        if (error.response.status === 403) {
            // Optionally redirect to error page
            window.location.href = Paths.ACCESS_DENIED;
        }

        // Or you can throw your own error to catch in the component
        throw new Error(message);
    } else {
        console.error('Unknown error:', error);
        throw new Error('An unexpected error occurred');
    }
};