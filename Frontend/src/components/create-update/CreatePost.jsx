import React, { useState, useEffect } from "react";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useNavigate } from "react-router-dom";
import { createShortStory } from "../../Api-calls/createShortStory.js";
import { toast } from 'react-toastify';
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";

import { Loader2, UploadCloud, X } from "lucide-react"; // Icons for better UX
import { categories } from "../../utils/Categories.jsx";
import imageCompression from "browser-image-compression";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const CreatePost = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    // Form State
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [finalQ, setFinalQ] = useState("");
    const [finalA, setFinalA] = useState("");
    const [status, setStatus] = useState("draft");
    const [story, setStory] = useState("");

    // Media State
    const [coverImg, setCoverImg] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);

    const [posterImg, setPosterImg] = useState(null);
    const [posterPreview, setPosterPreview] = useState(null);



    // UI State
    const [step, setStep] = useState(1);
    const [compressing, setCompressing] = useState(false);


    /* ================= PREVENT ACCIDENTAL CLOSE ================= */
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (title || story || coverImg || posterImg || description || finalQ || finalA || status) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [title, story, coverImg]);

    /* ================= EDITOR SETUP ================= */
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: false,
            }),
            Placeholder.configure({
                placeholder: "Start writing your story...",
            }),

        ],
        content: "<p></p>", // IMPORTANT

        onUpdate: ({ editor }) => {
            setStory(editor.getHTML());
        },
    });

    /* ================= IMAGE HANDLER ================= */
    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        e.target.value = null; // Reset file input to allow re-uploading the same file if needed

        // Skip compression for small images (<1.2MB)
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

            const webpFile = new File(
                [compressedFile],
                file.name.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
                { type: "image/webp" }
            );

            setCoverImg(webpFile);
            setPreviewUrl(URL.createObjectURL(webpFile));

            console.log(
                "Image optimized:",
                (file.size / 1024 / 1024).toFixed(2),
                "MB →",
                (webpFile.size / 1024 / 1024).toFixed(2),
                "MB"
            );

        } catch (error) {
            console.error("Image compression error:", error);
            toast.error("Failed to process image");
        } finally {
            setCompressing(false);
        }
    };


    // Poster image handler 
    const handlePosterChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        e.target.value = null; // Reset file input to allow re-uploading the same file if needed

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

            const webpFile = new File(
                [compressedFile],
                file.name.replace(/\.(jpg|jpeg|png)$/i, ".webp"),
                { type: "image/webp" }
            );

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

    const createPostMutation = useMutation({
        mutationFn: createShortStory, // cleaner

        retry: (failureCount, error) => {
            // Retry only for network errors (no response object)
            if (!error?.response) return failureCount < 2;
            return false;
        },

        retryDelay: (attemptIndex) =>
            Math.min(1000 * 2 ** attemptIndex, 3000), // exponential backoff

        onSuccess: (result) => {
            if (result?.success) {
                toast.success("Story created! +30 XP Reward 🌟");

                // 🔥 Invalidate home feed so it refreshes automatically
                queryClient.invalidateQueries({
                    queryKey: ["shortStories"],
                });

                // Reset form
                setTitle("");
                setStory("");
                setCoverImg(null);
                setPreviewUrl(null);
                setPosterImg(null);
                setPosterPreview(null);

                navigate("/home");
            } else {
                toast.error(result?.message || "Failed to create story");
            }
        },

        onError: (error) => {
            console.error("Create Story Error:", error);
            toast.error("Something went wrong. Please try again.");
        },
    });

    /* ================= SUBMIT ================= */
    const handleSave = (e) => {
        e.preventDefault();

        if (!title.trim() || !story.trim()) {
            return toast.error("Title and story content are required");
        }

        if (!coverImg) {
            return toast.error("Cover image is required");
        }

        if (!posterImg) {
            return toast.error("Poster image is required");
        }

        if (compressing) {
            toast.info("Processing image, please wait...");
            return;
        }

        const formData = new FormData();
        formData.append("title", title);
        formData.append("category", genre);
        formData.append("description", description);
        formData.append("finalQuestion", finalQ);
        formData.append("finalAnswer", finalA);
        formData.append("status", status);
        formData.append("story", story);
        formData.append("coverImage", coverImg);
        formData.append("posterImage", posterImg);

        createPostMutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-[#0f2a24] via-[#0b1412] to-black text-gray-200 pb-16 font-sans">

            <div className="max-w-5xl mx-auto mt-6 sm:mt-12 bg-[#141a18] rounded-2xl sm:rounded-3xl shadow-2xl border border-white/5 p-6 sm:p-8 md:p-10">

                {/* ================= HEADER ================= */}
                <div className="mb-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-white/10 pb-6">
                    <div>
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                            Write Your Story
                        </h1>
                        <p className="text-gray-400 text-sm mt-1">Share your imagination with the world.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="text-sm font-medium text-gray-400">Status:</span>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="px-4 py-2 text-sm bg-white/5 text-white font-medium border border-white/10 rounded-lg cursor-pointer hover:bg-white/10 focus:ring-2 focus:ring-emerald-500/50 outline-none transition"
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Publish</option>
                        </select>
                    </div>
                </div>

                {/* ================= PROGRESS BAR ================= */}
                <div className="mb-12 relative">
                    <div className="flex items-center justify-between max-w-md mx-auto relative z-10">
                        <button
                            onClick={() => setStep(1)}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${step === 1
                                ? "bg-[#0b1412] text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                : "bg-[#1a2220] text-gray-400 border border-white/5 hover:text-gray-200"
                                }`}
                        >
                            1. Story Content
                        </button>
                        <button
                            onClick={() => setStep(2)}
                            disabled={!title || !story}
                            className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed ${step === 2
                                ? "bg-[#0b1412] text-emerald-400 border border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                                : "bg-[#1a2220] text-gray-400 border border-white/5 hover:text-gray-200"
                                }`}
                        >
                            2. Details & Cover
                        </button>
                    </div>

                    {/* Progress Line */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md z-0 pointer-events-none px-20">
                        <div className="h-[2px] bg-white/5 w-full rounded-full overflow-hidden">
                            <div
                                className={`h-full bg-emerald-500/50 transition-all duration-500 ease-in-out ${step === 1 ? "w-0" : "w-full"
                                    }`}
                            />
                        </div>
                    </div>
                </div>

                {/* ================= STEP 1: CONTENT ================= */}
                {step === 1 && (
                    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                        <div className="mb-6">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter a captivating title..."
                                className="w-full bg-transparent text-3xl md:text-4xl font-bold text-white placeholder:text-gray-600 border-none outline-none focus:ring-0 py-2"
                            />
                        </div>

                        <div className="blog-editor border border-white/10 rounded-2xl bg-[#1A1A1A] flex">

                            {editor && (
                                <RichTextEditor
                                    editor={editor}
                                    styles={{
                                        root: {
                                            display: "flex",
                                            width: "100%",
                                        },

                                        control: {
                                            backgroundColor: "transparent",
                                            border: "none",
                                            color: "#9ca3af",

                                            '&:hover': {
                                                backgroundColor: "rgba(255,255,255,0.08)",
                                                color: "#fff"
                                            },

                                            '&[data-active]': {
                                                backgroundColor: "#10b981",
                                                color: "#000"
                                            }
                                        },
                                        controlsGroup: {
                                            backgroundColor: "transparent"
                                        },
                                        toolbar: {
                                            position: "sticky",
                                            top: "0",
                                            height: "100%",
                                            backgroundColor: "#1A1A1A",
                                            borderRight: "1px solid rgba(255,255,255,0.05)",
                                            padding: "10px",
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "6px"
                                        },


                                        content: {
                                            height: "600px",
                                            overflowY: "auto",
                                            flex: 1,
                                            padding: "24px",
                                            color: "#e5e7eb",
                                            fontSize: "1.125rem",
                                            lineHeight: "1.75",

                                            scrollbarWidth: "none",
                                            msOverflowStyle: "none",

                                            '&::-webkit-scrollbar': {
                                                display: "none"
                                            }
                                        }
                                    }}
                                >
                                    <RichTextEditor.Toolbar>

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
                                disabled={!title}
                                className="px-8 py-3.5 rounded-xl bg-emerald-600 text-white font-bold hover:bg-emerald-500 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg shadow-emerald-900/20"
                            >
                                Continue to Details →
                            </button>
                        </div>
                    </div>
                )}

                {/* ================= STEP 2: METADATA ================= */}
                {step === 2 && (
                    <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

                            {/* LEFT COLUMN */}
                            <div className="space-y-6">
                                <Field label="Genre">
                                    <select
                                        value={genre}
                                        onChange={(e) => setGenre(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-gray-200 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
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
                                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                                        placeholder="What is this story about?"
                                    />
                                </Field>

                                <Field label="Question for Readers to Solve">
                                    <input
                                        value={finalQ}
                                        onChange={(e) => setFinalQ(e.target.value)}
                                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
                                        placeholder="e.g. Who was the killer?"
                                    />
                                </Field>

                                <Field label="Answer / Hidden Summary">
                                    <textarea
                                        value={finalA}
                                        onChange={(e) => setFinalA(e.target.value)}
                                        rows={3}
                                        className="w-full px-4 py-3 bg-[#1A1A1A] border border-white/10 rounded-xl text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all resize-none"
                                        placeholder="The answer to the question above..."
                                    />
                                </Field>
                            </div>

                            {/* RIGHT COLUMN (IMAGE) */}
                            <div>
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">Cover Image</label>

                                <label className={`
                                relative flex flex-col items-center justify-center w-full h-[380px] 
                                rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group
                                ${previewUrl ? 'border-emerald-500/50 bg-[#1A1A1A]' : 'border-white/10 hover:border-emerald-500/40 hover:bg-white/5 bg-[#1A1A1A]'}
                            `}>
                                    {previewUrl ? (
                                        <>
                                            <img src={previewUrl} alt="Cover" className="w-full h-full object-cover transition duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <p className="text-white font-medium bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">Change Image</p>
                                            </div>
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-4 right-4 bg-black/60 p-2.5 rounded-full hover:bg-red-500 transition-colors text-white backdrop-blur-sm z-10"
                                            >
                                                <X size={18} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-8">
                                            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300">
                                                <UploadCloud size={32} className="text-emerald-500" />
                                            </div>
                                            <p className="text-gray-200 font-semibold text-lg mb-1">Upload Cover Art</p>
                                            <p className="text-gray-500 text-sm">Drag and drop or click to browse</p>
                                            <p className="text-gray-600 text-xs mt-4">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>

                            {/* POSTER IMAGE */}
                            <div className="mt-6">
                                <label className="text-sm font-semibold text-gray-300 mb-3 block">
                                    Poster Image (Optional)
                                </label>

                                <label className={`
        relative flex flex-col items-center justify-center w-full h-[200px] 
        rounded-2xl border-2 border-dashed transition-all cursor-pointer overflow-hidden group
        ${posterPreview ? 'border-emerald-500/50 bg-[#1A1A1A]' : 'border-white/10 hover:border-emerald-500/40 hover:bg-white/5 bg-[#1A1A1A]'}
    `}>
                                    {posterPreview ? (
                                        <>
                                            <img src={posterPreview} alt="Poster" className="w-full h-full object-cover" />

                                            <button
                                                onClick={removePoster}
                                                className="absolute top-3 right-3 bg-black/60 p-2 rounded-full hover:bg-red-500 text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center">
                                            <UploadCloud size={28} className="text-emerald-500 mx-auto mb-2" />
                                            <p className="text-sm text-gray-400">Upload Poster</p>
                                        </div>
                                    )}

                                    <input
                                        type="file"
                                        className="hidden"
                                        accept="image/*"
                                        onChange={handlePosterChange}
                                    />
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col-reverse sm:flex-row justify-between items-center mt-12 pt-8 border-t border-white/10 gap-4">
                            <button
                                onClick={() => setStep(1)}
                                className="w-full sm:w-auto px-6 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-colors font-semibold"
                            >
                                ← Back to Story
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={createPostMutation.isPending || compressing}
                                className={`
                                w-full sm:w-auto px-10 py-3.5 rounded-xl font-bold text-white shadow-lg flex items-center justify-center gap-3
                                transition-all active:scale-95
                                ${(createPostMutation.isPending || compressing)
                                        ? "bg-gray-700 cursor-not-allowed"
                                        : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-[0_0_20px_rgba(16,185,129,0.3)]"}
                            `}
                            >
                                {(createPostMutation.isPending || compressing) &&
                                    <Loader2 className="animate-spin" size={20} />
                                }
                                {compressing
                                    ? "Optimizing..."
                                    : createPostMutation.isPending
                                        ? "Saving..."
                                        : "Publish Story"}
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

export default CreatePost;