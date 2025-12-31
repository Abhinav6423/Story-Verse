import { useEffect, useRef, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";

const VerifyEmail = () => {
    const [params] = useSearchParams();
    const navigate = useNavigate();
    const hasRun = useRef(false);

    const [status, setStatus] = useState("verifying");
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (hasRun.current) return; // ⛔ STOP second run
        hasRun.current = true;

        const token = params.get("token");

        if (!token) {
            setStatus("error");
            setMessage("Invalid verification link");
            return;
        }

        axios
            .get(
                `${import.meta.env.VITE_BACKEND_URL}/api/auth/verify-email?token=${token}`
            )
            .then((res) => {
                setStatus("success");
                setMessage(res.data.message || "Email verified successfully");

                setTimeout(() => {
                    navigate("/");
                }, 2000);
            })
            .catch((err) => {
                setStatus("error");
                setMessage(
                    err?.response?.data?.message ||
                    "Verification failed or link expired"
                );
            });
    }, []);

    return (
        <div className="min-h-screen flex items-center justify-center bg-[#f8f9fb] px-4">
            <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-6 text-center">
                {status === "verifying" && (
                    <>
                        <h2 className="text-lg font-semibold mb-2">
                            Verifying email…
                        </h2>
                        <p className="text-gray-500">Please wait</p>
                    </>
                )}

                {status === "success" && (
                    <>
                        <h2 className="text-lg font-semibold text-green-600 mb-2">
                            ✅ Email Verified
                        </h2>
                        <p className="text-gray-600">{message}</p>
                        <p className="text-sm text-gray-400 mt-2">
                            Redirecting to login…
                        </p>
                    </>
                )}

                {status === "error" && (
                    <>
                        <h2 className="text-lg font-semibold text-red-600 mb-2">
                            ❌ Verification Failed
                        </h2>
                        <p className="text-gray-600">{message}</p>
                    </>
                )}
            </div>
        </div>
    );
};

export default VerifyEmail;
