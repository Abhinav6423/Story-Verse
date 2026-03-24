import React from "react";
import { useEffect, useState, useCallback } from "react";
import AuthContext from "./Authcontext.js";
import { meRoute } from "../Api-calls/meRoute.js";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase.js";


const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  const fetchUserData = useCallback(async () => {
    try {
      const result = await meRoute();
      if (result?.success) {
        console.log("User Datas aress" , result.user)
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
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        setUserData(null);
        setLoading(false);   // 🔥 IMPORTANT
        setAuthReady(true);
        return;
      }

      setAuthReady(true);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (authReady) {
      fetchUserData();
    }
  }, [authReady, fetchUserData]);

  return (
    <AuthContext.Provider
      value={{
        userData,
        setUserData,
        loading,
        reloadUserData: fetchUserData,
      }}
    >
      {children} {/* ✅ NEVER BLOCK */}
    </AuthContext.Provider>
  );
};

export default AuthProvider;