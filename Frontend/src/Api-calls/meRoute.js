import axios from "axios"

export const meRoute = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/auth/me`, { withCredentials: true })
        return {
            success: true,
            message: "User data fetched successfully",
            data: res?.data
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data
        }
    }
}

