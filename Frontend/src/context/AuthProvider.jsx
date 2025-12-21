import { useEffect, useState, useCallback } from "react";
import AuthContext from "./Authcontext.js";
import { meRoute } from "../Api-calls/meRoute.js";

const AuthProvider = ({ children }) => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUserData = useCallback(async () => {
        try {
            setLoading(true);
            const result = await meRoute();

            if (result?.success) {
                setUserData(result?.data?.user);
                console.log(result.data.user)
            } else {
                setUserData(null);
                console.error(result.message);
            }
        } catch (error) {
            console.error("Auth fetch error:", error);
            setUserData(null);
        } finally {
            setLoading(false);
        }
    } , []);

    useEffect(() => {
        fetchUserData();
    }, []);

    const reloadUserData = () => {
        fetchUserData();
    };

    return (
        <AuthContext.Provider
            value={{
                userData,
                setUserData,
                loading,
                reloadUserData,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;
