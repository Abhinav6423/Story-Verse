// import React from "react";
// import { useEffect, useState, useCallback } from "react";
// import AuthContext from "./Authcontext.js";
// import { meRoute } from "../Api-calls/meRoute.js";

// const AuthProvider = ({ children }) => {
//   const [userData, setUserData] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const fetchUserData = useCallback(async () => {
//     try {
//       const result = await meRoute();

//       if (result?.success) {
//         setUserData(result.user);
//       } else {
//         setUserData(null);
//       }
//     } catch {
//       setUserData(null);
//     } finally {
//       setLoading(false);
//     }
//   }, []);

//   useEffect(() => {
//     fetchUserData();
//   }, [fetchUserData]);




//   return (
//     <AuthContext.Provider
//       value={{
//         userData,
//         setUserData,
//         loading,
//         reloadUserData: fetchUserData,
//       }}
//     >
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;


import { useEffect, useState, useCallback } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase";
import AuthContext from "./Authcontext.js";
import { meRoute } from "../Api-calls/meRoute.js";

const AuthProvider = ({ children }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);        // backend loading
  const [authReady, setAuthReady] = useState(false);  // 🔥 firebase ready

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

  // 🔐 WAIT FOR FIREBASE FIRST
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (!firebaseUser) {
        // user genuinely logged out
        setUserData(null);
        setLoading(false);
        setAuthReady(true);
        return;
      }

      // firebase restored session
      setAuthReady(true);
    });

    return () => unsubscribe();
  }, []);

  // 🚀 CALL BACKEND ONLY AFTER FIREBASE IS READY
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
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

