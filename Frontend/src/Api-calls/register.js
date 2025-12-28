import axios from "axios";

export const registerUser = async ({ username, email, password }) => {
    try {
        const res = await axios.post(
            `${import.meta.env.VITE_BACKEND_URL}/api/auth/register`,
            { username, email, password },
            { withCredentials: true }
        );

        console.log(res?.data);

        return {
            success: true,
            message: "User registered successfully",
            data: res?.data
        };
    } catch (error) {
        console.log(error);

        return {
            success: false,
            message: error?.response?.data?.message || "Registration failed"
        };
    }
};
