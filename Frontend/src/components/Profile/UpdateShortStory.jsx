import React, { useState, useEffect } from "react";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from 'react-toastify';
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2, UploadCloud, X, ArrowLeft } from "lucide-react";
// 🔥 CRITICAL FIX: Missing import for image compression
import imageCompression from 'browser-image-compression';
import { categories } from "../../utils/Categories.jsx";

// API Calls
import { openUserShortStory } from "../../Api-calls/openUserShortStories.js";
import { updateShortStory } from "../../Api-calls/updateShortStory.js";

const UpdateShortStory = () => {
    const { storyId } = useParams();
    const navigate = useNavigate();

    // Data Fetching State
    const [fetching, setFetching] = useState(true);

    // Form State
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [finalQ, setFinalQ] = useState("");
    const [finalA, setFinalA] = useState("");
    const [status, setStatus] = useState("draft");
    const [storyContent, setStoryContent] = useState("");

    // Media State
    const [coverImg, setCoverImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [posterImg, setPosterImg] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);
    const [compressing, setCompressing] = useState(false);

    // UI State
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    /* ================= PREVENT ACCIDENTAL CLOSE ================= */
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (!loading) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [loading]);

    /* ================= MEMORY LEAK CLEANUP ================= */
    useEffect(() => {
        // Cleanup object URLs to avoid memory leaks when component unmounts or URLs change
        return () => {
            if (previewUrl && previewUrl.startsWith('blob:')) URL.revokeObjectURL(previewUrl);
            if (posterPreview && posterPreview.startsWith('blob:')) URL.revokeObjectURL(posterPreview);
        };
    }, [previewUrl, posterPreview]);

    /* ================= EDITOR SETUP ================= */
    const editor = useEditor({
        extensions: [
            StarterKit.configure({ link: false }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            setStoryContent(editor.getHTML());
        },
    });

    /* ================= 1. FETCH EXISTING DATA ================= */
    useEffect(() => {
        const fetchStoryData = async () => {
            if (!storyId) return;
            try {
                const result = await openUserShortStory({ storyId });

                if (result?.success) {
                    const data = result.data;

                    setTitle(data.title);
                    setGenre(data.category);
                    setDescription(data.description);
                    setFinalQ(data.finalQuestion || "");
                    setFinalA(data.finalAnswer || "");
                    setStatus(data.status || "draft");
                    setCoverImg(data.coverImage);
                    setStoryContent(data.story);
                    setPosterImg(data.posterImage);
                    setPreviewUrl(data.coverImage);
                    setPosterPreview(data.posterImage);

                    if (editor) {
                        editor.commands.setContent(data.story);
                    }
                } else {
                    toast.error("Could not load story");
                    navigate("/home");
                }
            } catch (error) {
                console.error(error);
                toast.error("Error fetching story details");
            } finally {
                setFetching(false);
            }
        };

        if (editor) {
            fetchStoryData();
        }
    }, [storyId, editor, navigate]);

    /* ================= IMAGE HANDLERS ================= */
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = null;

        if (file.size / 1024 / 1024 < 1.2) {
            setCoverImg(file);
            setPreviewUrl(URL.createObjectURL(file));
            return;
        }

        setCompressing(true);
        try {
            const options = {
                maxSizeMB: 0.6,
                maxWidthOrHeight: 1000,
                initialQuality: 0.85,
                useWebWorker: true,
                fileType: "image/webp",
            };

            const compressedFile = await imageCompression(file, options);
            const webpFile = new File([compressedFile], file.name.replace(/\.(jpg|jpeg|png)$/i, ".webp"), { type: "image/webp" });

            setCoverImg(webpFile);
            setPreviewUrl(URL.createObjectURL(webpFile));
        } catch (error) {
            console.error("Image compression error:", error);
            toast.error("Failed to process image");
        } finally {
            setCompressing(false);
        }
    };

    const handlePosterChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = null;

        if (file.size / 1024 / 1024 < 1.2) {
            setPosterImg(file);
            setPosterPreview(URL.createObjectURL(file));
            return;
        }

        setCompressing(true);
        try {
            const options = {
                maxSizeMB: 0.6,
                maxWidthOrHeight: 1000,
                initialQuality: 0.85,
                useWebWorker: true,
                fileType: "image/webp",
            };

            const compressedFile = await imageCompression(file, options);
            const webpFile = new File([compressedFile], file.name.replace(/\.(jpg|jpeg|png)$/i, ".webp"), { type: "image/webp" });

            setPosterImg(webpFile);
            setPosterPreview(URL.createObjectURL(webpFile));
        } catch (error) {
            console.error("Poster compression error:", error);
            toast.error("Failed to process poster image");
        } finally {
            setCompressing(false);
        }
    };

    const removeImage = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setCoverImg(null);
        setPreviewUrl(null);
    };

    const removePoster = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setPosterImg(null);
        setPosterPreview(null);
    };

    /* ================= SUBMIT ================= */
    const handleUpdate = async (e) => {
        e.preventDefault();

        if (!title.trim() || !storyContent.trim()) {
            return toast.error("Title and story content are required");
        }

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", genre);
            formData.append("description", description);
            formData.append("finalQuestion", finalQ);
            formData.append("finalAnswer", finalA);
            formData.append("status", status);
            formData.append("story", storyContent);

            if (posterImg && typeof posterImg !== 'string') {
                formData.append("posterImage", posterImg);
            }
            if (coverImg && typeof coverImg !== 'string') {
                formData.append("coverImage", coverImg);
            }

            const result = await updateShortStory(formData, storyId);

            if (result?.success) {
                toast.success("Story updated successfully!");
                navigate("/profile");
            } else {
                toast.error(result?.message || "Failed to update story");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    // Show full screen loader while fetching initial data
    if (fetching) {
        return (
            <div className="min-h-screen bg-[#0b1412] flex items-center justify-center">
                <Loader2 className="animate-spin text-emerald-500" size={40} />
            </div>
        );
    }

    // Common input styling class
    const inputStyle = "w-full px-4 py-3 bg-black/40 border border-white/10 rounded-xl text-white placeholder:text-gray-600 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all";

    return (
        <div className="min-h-screen border-black/70 border bg-gradient-to-b from-[#0f2a24] via-[#0b1412] to-black text-gray-200 pb-16">

            <div className="max-w-5xl mx-auto mt-6 sm:mt-10 bg-[#141a18] rounded-2xl sm:rounded-3xl shadow-xl border border-white/10 p-4 sm:p-6 md:p-8">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 rounded-full hover:bg-white/5 text-gray-400 hover:text-white transition"
                        >
                            <ArrowLeft size={24} />
                        </button>
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-200">
                            Update Story
                        </h1>
                    </div>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 text-sm bg-[#005c48] text-white font-bold border border-white/20 rounded-lg cursor-pointer hover:bg-[#004d3d] focus:outline-none transition"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Publish</option>
                    </select>
                </div>

                {/* ================= PROGRESS BAR ================= */}
                <div className="mb-12">
                    <div className="flex items-center justify-between max-w-sm mx-auto mb-4 relative z-10">
                        <button
                            onClick={() => setStep(1)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${step === 1 ? "bg-[#0b1412] text-emerald-300 border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]" : "bg-[#0b1412] text-gray-400 border border-white/10"}`}
                        >
                            Step 1
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            className={`px-6 py-2 rounded-full text-sm font-semibold transition-all ${step === 2 ? "bg-[#0b1412] text-emerald-300 border border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.35)]" : "bg-[#0b1412] text-gray-400 border border-white/10"}`}
                        >
                            Step 2
                        </button>
                    </div>

                    {/* Progress Line */}
                    <div className="relative max-w-sm mx-auto top-[-20px] z-0">
                        <div className="h-[2px] bg-white/10 w-full absolute top-1/2" />
                        <div
                            className={`h-[2px] bg-emerald-500 absolute top-1/2 transition-all duration-300 ${step === 1 ? "w-1/2" : "w-full"}`}
                        />
                    </div>
                </div>

                {/* ================= STEP 1: CONTENT ================= */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
                        <div className="mb-6">
                            <label className="text-sm font-medium text-gray-300 mb-2 block">Title</label>
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a captivating title..."
                                className={`${inputStyle} text-lg font-semibold`}
                            />
                        </div>

                        <div className="blog-editor border border-white/10 rounded-2xl overflow-hidden">
                            {editor && (
                                <RichTextEditor
                                    editor={editor}
                                    styles={{
                                        root: { border: "none" },
                                        content: {
                                            minHeight: "350px",
                                            backgroundColor: "#1A1A1A",
                                            color: "#e5e7eb",
                                            fontSize: "16px",
                                            padding: "20px"
                                        },
                                        toolbar: {
                                            backgroundColor: "#222",
                                            borderBottom: "1px solid rgba(255,255,255,0.1)",
                                        },
                                        control: {
                                            color: "#9ca3af",
                                            border: "none",
                                            '&:hover': { backgroundColor: "rgba(255,255,255,0.1)" }
                                        }
                                    }}
                                >
                                    <RichTextEditor.Toolbar sticky stickyOffset={60}>
                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.Bold />
                                            <RichTextEditor.Italic />
                                            <RichTextEditor.Underline />
                                            <RichTextEditor.Strikethrough />
                                            <RichTextEditor.Highlight />
                                            <RichTextEditor.Code />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.H1 />
                                            <RichTextEditor.H2 />
                                            <RichTextEditor.H3 />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.BulletList />
                                            <RichTextEditor.OrderedList />
                                            <RichTextEditor.Blockquote />
                                            <RichTextEditor.Hr />
                                        </RichTextEditor.ControlsGroup>

                                        <RichTextEditor.ControlsGroup>
                                            <RichTextEditor.AlignLeft />
                                            <RichTextEditor.AlignCenter />
                                            <RichTextEditor.AlignJustify />
                                            <RichTextEditor.AlignRight />
                                        </RichTextEditor.ControlsGroup>
                                    </RichTextEditor.Toolbar>
                                    <RichTextEditor.Content />
                                </RichTextEditor>
                            )}
                        </div>

                        <div className="flex justify-end mt-8">
                            <button
                                onClick={() => setStep(2)}
                                className="px-8 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-600 transition shadow-[0_0_15px_rgba(4,120,87,0.3)] hover:shadow-[0_0_20px_rgba(4,120,87,0.5)]"
                            >
                                Continue to Details →
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 2: METADATA ================= */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-300">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                            {/* LEFT COLUMN */}
                            <div className="space-y-6">
                                <Field label="Genre">
                                    <select
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className={inputStyle}
                                    >
                                        <option disabled value="">Select Genre</option>
                                        {categories.map((cat) => (
                                            <option key={cat.name} value={cat.name}>{cat.name}</option>
                                        ))}
                                    </select>
                                </Field>

                                <Field label="Short Description">
                                    <textarea
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={4}
                                        className={`${inputStyle} resize-none`}
                                        placeholder="What is this story about?"
                                    />
                                </Field>

                                <Field label="Question for Readers (Optional)">
                                    <input
                                        value={finalQ}
                                        onChange={(e) => setFinalQ(e.target.value)}
                                        className={inputStyle}
                                        placeholder="e.g. Who was the killer?"
                                    />
                                </Field>

                                <Field label="Answer / Hidden Summary">
                                    <textarea
                                        value={finalA}
                                        onChange={(e) => setFinalA(e.target.value)}
                                        rows={3}
                                        className={`${inputStyle} resize-none`}
                                        placeholder="The answer to the question above..."
                                    />
                                </Field>
                            </div>

                            {/* RIGHT COLUMN (IMAGE) */}
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-2 block">Cover Image</label>

                                <label className={`
                                    relative flex flex-col items-center justify-center w-full h-[300px] 
                                    rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                                    ${previewUrl ? 'border-emerald-500/50' : 'border-gray-600 hover:border-emerald-400 hover:bg-white/5'}
                                `}>
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Cover" className="w-full h-full object-cover" />
                                            {/* X button to clear image */}
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hover:bg-red-500/80 transition text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                            {/* Badge if it's the existing server image */}
                                            {!coverImg && typeof previewUrl === 'string' && !previewUrl.startsWith('blob:') && (
                                                <div className="absolute bottom-2 right-2 bg-black/80 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-emerald-400 border border-white/10">
                                                    Current Cover
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <UploadCloud size={48} className="mx-auto text-gray-500 mb-3" />
                                            <p className="text-gray-300 font-medium">Click to upload new cover</p>
                                            <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                            <div>
                                <label className="text-sm font-medium text-gray-300 mb-2 block">Poster Image</label>

                                <label className={`
                                    relative flex flex-col items-center justify-center w-full h-[300px] 
                                    rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden
                                    ${posterPreview ? 'border-emerald-500/50' : 'border-gray-600 hover:border-emerald-400 hover:bg-white/5'}
                                `}>
                                    {posterPreview ? (
                                        <>
                                            <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />
                                            {/* X button to clear image */}
                                            <button
                                                onClick={removePoster}
                                                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hover:bg-red-500/80 transition text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                            {/* Badge if it's the existing server image */}
                                            {!posterImg && typeof posterPreview === 'string' && !posterPreview.startsWith('blob:') && (
                                                <div className="absolute bottom-2 right-2 bg-black/80 px-3 py-1.5 rounded-full text-[10px] uppercase tracking-widest font-bold text-emerald-400 border border-white/10">
                                                    Current Poster
                                                </div>
                                            )}
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <UploadCloud size={48} className="mx-auto text-gray-500 mb-3" />
                                            <p className="text-gray-300 font-medium">Click to upload new poster</p>
                                            <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handlePosterChange} />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition font-medium flex items-center gap-2"
                            >
                                <ArrowLeft size={16} /> Back to Story
                            </button>

                            <button
                                onClick={handleUpdate}
                                disabled={loading || compressing}
                                className={`
                                    px-8 py-3 rounded-xl font-bold text-white flex items-center gap-2
                                    transition-all active:scale-95 uppercase tracking-wide text-sm
                                    ${(loading || compressing) ? "bg-gray-700 cursor-not-allowed text-gray-400" : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]"}
                                `}
                            >
                                {(loading || compressing) ? <Loader2 className="animate-spin" size={18} /> : null}
                                {compressing ? "Processing Image..." : loading ? "Updating..." : "Update Story"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

const Field = ({ label, children }) => (
    <div className="mb-5">
        <label className="text-sm font-medium text-gray-300 mb-2 block">{label}</label>
        {children}
    </div>
);

export default UpdateShortStory;