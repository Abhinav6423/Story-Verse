import axios from "axios";

export const registerUser = async ({ username, email, password }) => {
    try {
        const res = await axios.post(
            `/api/auth/register`,
            { username, email, password },
            { withCredentials: true }
        );

        // 🔑 return backend response AS-IS
        return res.data;

    } catch (error) {
        return {
            success: false,
            message:
                error?.response?.data?.message ||
                "Registration failed",
        };
    }
};
