import { jwtDecode } from 'jwt-decode';

export const isTokenExpired = (token: string | null) => {
  if (!token) return true;
  try {
    const decoded: any = jwtDecode(token);

    if (!decoded.exp) return true;
    const currentTime = Date.now() / 1000;
    return decoded.exp < currentTime;
  } catch (error) {
    console.error("Error decoding token:", error);
    return true;
  }
};