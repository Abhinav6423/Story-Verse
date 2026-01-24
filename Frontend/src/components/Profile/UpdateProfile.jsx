import { useState, useEffect } from "react";
import { X, Camera, Loader2 } from "lucide-react";
import { toast } from "react-toastify";

import { updateProfile } from "../../Api-calls/updateProfile.js";
import { useAuth } from "../../context/Authcontext.js";

const UpdateProfile = ({ onClose }) => {
    const { userData, setUserData } = useAuth();

    const [profilePic, setProfilePic] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(userData?.profilePic || null);
    const [username, setUsername] = useState(userData?.username || "");
    const [loading, setLoading] = useState(false);

    // MEMORY CLEANUP: Revoke object URL to avoid memory leaks
    useEffect(() => {
        return () => {
            if (previewUrl && previewUrl !== userData?.profilePic) {
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl, userData]);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        if (!username.trim() && !profilePic) {
            return toast.error("No changes detected");
        }

        try {
            setLoading(true);
            const formData = new FormData();
            if (username.trim() !== userData.username) {
                formData.append("username", username.trim());
            }
            if (profilePic) {
                formData.append("profilePic", profilePic);
            }

            const res = await updateProfile(formData);

            if (!res?.user) {
                throw new Error(res?.message || "Update failed");
            }

            toast.success("Profile updated successfully");

            setUserData((prev) => ({
                ...prev,
                ...res.user,
            }));

            onClose();
        } catch (error) {
            console.error(error);
            toast.error(error?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* OVERLAY */}
            <div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
                onClick={!loading ? onClose : undefined}
            />

            {/* MODAL */}
            <div
                className="
                    relative w-full max-w-md 
                    bg-[#0f1c18] border border-emerald-500/20 
                    rounded-2xl shadow-2xl overflow-hidden
                    animate-in fade-in zoom-in-95 duration-200
                "
            >
                {/* CLOSE BUTTON */}
                <button
                    onClick={onClose}
                    disabled={loading}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white disabled:opacity-50 transition-colors z-10"
                >
                    <X size={20} />
                </button>

                <div className="p-6 sm:p-8">
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-emerald-400">Edit Profile</h2>
                        <p className="text-sm text-gray-400 mt-1">Update your personal details</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">

                        {/* IMAGE UPLOAD - PREVIEW CIRCLE */}
                        <div className="flex justify-center">
                            <div className="relative group">
                                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-emerald-500/30 bg-[#0b1412]">
                                    {previewUrl ? (
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-emerald-600 font-bold text-2xl">
                                            {username?.[0]?.toUpperCase()}
                                        </div>
                                    )}
                                </div>

                                {/* Hover Overlay / Click Area */}
                                <label className="
                                    absolute inset-0 flex items-center justify-center 
                                    bg-black/50 opacity-0 group-hover:opacity-100 
                                    transition-opacity cursor-pointer rounded-full
                                ">
                                    <Camera className="text-white" size={24} />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handleImageChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>
                        </div>

                        {/* USERNAME INPUT */}
                        <div>
                            <label className="block text-xs font-medium text-emerald-500/80 uppercase tracking-wider mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                placeholder="Enter username"
                                className="
                                    w-full bg-[#0b1412] text-white rounded-xl 
                                    border border-emerald-500/20 px-4 py-3
                                    focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50
                                    placeholder:text-gray-600 transition-all
                                "
                            />
                        </div>

                        {/* SUBMIT BUTTON */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`
                                w-full flex items-center justify-center gap-2
                                py-3 rounded-xl font-semibold text-black
                                transition-all active:scale-[0.98]
                                ${loading
                                    ? "bg-emerald-700/50 cursor-not-allowed text-white/50"
                                    : "bg-emerald-500 hover:bg-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                }
                            `}
                        >
                            {loading && <Loader2 className="animate-spin" size={18} />}
                            {loading ? "Saving Changes..." : "Save Changes"}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default UpdateProfile;