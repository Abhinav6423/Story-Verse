import { useState } from "react";
import { X } from "lucide-react";
import { toast } from "react-toastify";

import { updateProfile } from "../../Api-calls/updateProfile.js";
import { useAuth } from "../../context/Authcontext.js";
import Loading from "../Loader.jsx";

const UpdateProfile = ({ onClose }) => {


    const [profilePic, setProfilePic] = useState(null);
    const [loading, setLoading] = useState(false);

    const { userData, setUserData } = useAuth();
    const [username, setUsername] = useState(() => userData?.username || "");
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (loading) return;

        if (!username.trim() && !profilePic) {
            toast.error("At least one field is required");
            return;
        }

        try {
            setLoading(true);

            const formData = new FormData();
            if (username.trim()) formData.append("username", username.trim());
            if (profilePic) formData.append("profilePic", profilePic);

            const res = await updateProfile(formData);

            // ✅ always validate response
            if (!res?.user) {
                toast.error(res?.message || "Update failed");
                return;
            }

            toast.success(res?.message || "Profile updated successfully");

            setUserData((prev) => ({
                ...prev,
                ...res.user,
            }));

            onClose();
            return; // ✅ critical
        } catch (error) {
            toast.error(
                error?.message || "Something went wrong teri amma ka bhi"
            );
        } finally {
            setLoading(false);
        }
    };


    if (loading) return <Loading />


    return (
        <>
            {/* 🔮 Overlay */}
            <div
                className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
                onClick={onClose}
            />

            {/* 🟢 Modal */}
            <div className="fixed inset-0 flex items-center justify-center z-50">
                <div
                    className="w-full max-w-md rounded-2xl bg-[#0b1f16]
          border border-emerald-500/30 shadow-2xl p-6 relative"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* ❌ Close */}
                    <button
                        onClick={onClose}
                        className="absolute top-4 right-4 text-gray-400 hover:text-white"
                    >
                        <X size={20} />
                    </button>

                    {/* Header */}
                    <h2 className="text-2xl font-semibold text-emerald-400 mb-1">
                        Update Profile
                    </h2>
                    <p className="text-sm text-gray-400 mb-6">
                        Change your username or profile picture
                    </p>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Username */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter new username"
                                className="w-full rounded-lg bg-[#102a1f]
                border border-emerald-500/30 px-4 py-2 text-white
                focus:ring-2 focus:ring-emerald-500"
                            />
                        </div>

                        {/* Profile Pic */}
                        <div>
                            <label className="block text-sm text-gray-300 mb-1">
                                Profile Picture
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProfilePic(e.target.files[0])}
                                className="w-full text-sm text-gray-300
                  file:mr-4 file:py-2 file:px-4
                  file:rounded-lg file:border-0
                  file:bg-emerald-500 file:text-black
                  hover:file:bg-emerald-400"
                            />
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full mt-4 rounded-lg bg-emerald-500
              py-2 font-semibold text-black hover:bg-emerald-400
              transition disabled:opacity-60"
                        >
                            {loading ? "Saving..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default UpdateProfile;
