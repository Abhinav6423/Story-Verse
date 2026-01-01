import { useEffect, useState, useCallback } from "react";
import AuthContext from "./Authcontext.js";
import { meRoute } from "../Api-calls/meRoute.js";

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUserData = useCallback(async () => {
    try {
      const result = await meRoute();

      if (result?.success) {
        setUserData(result.user);
      } else {
        setUserData(null);
      }
    } catch {
      setUserData(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserData();
  }, [fetchUserData]);
  



  return (
    <AuthContext.Provider
      value={{
        userData,
        loading,
        reloadUserData: fetchUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
