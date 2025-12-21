import axios from "axios"

export const getUserProfileData = async () => {
    try {
        const res = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/api/profile/userProfile`, { withCredentials: true })
        return res?.data // 🔥 return raw backend response
    } catch (error) {
        return error?.response?.data
    }
}