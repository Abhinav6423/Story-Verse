import axios from "axios"

export const loginUser = async (email, password) => {
    try {
        const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/api/auth/login`,
            {
                email,
                password
            }, { withCredentials: true })


        return {
            success: true,
            message: "User logged in successfully",
            data: res?.data
        }
    } catch (error) {
        return {
            success: false,
            message: error?.response?.data?.message || "Login failed"
        }
    }
}