import { GoogleLogin } from "@react-oauth/google";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/Authcontext.js";
import { toast } from "react-toastify";

const GoogleButton = () => {
  const navigate = useNavigate();
  const { reloadUserData } = useAuth();

  const handleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;

      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/auth/google`,
        { token: idToken },
        { withCredentials: true }
      );

      if (res.data?.success) {
        await reloadUserData(); // sync auth context
        toast.success("Logged in with Google 🎉");
        navigate("/home");
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      console.error("Google auth error:", error);
      toast.error("Google login failed");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleSuccess}
        onError={() => toast.error("Google login failed")}
      />
    </div>
  );
};

export default GoogleButton;
