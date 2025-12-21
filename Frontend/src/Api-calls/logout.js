import axios from "axios";

export const logoutUser = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/logout`, { withCredentials: true })
        return {
            success: true,
            message: "User logged out successfully",
            data: res?.data
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data
        }
    }
}