import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/Authcontext.js";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const { reloadUserData } = useAuth();

  useEffect(() => {
    const sync = async () => {
      await reloadUserData();
      navigate("/home");
    };
    sync();
  }, []);

  return <p>Logging you in...</p>;
};

export default AuthSuccess;
