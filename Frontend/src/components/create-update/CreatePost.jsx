import React, { useState, useEffect } from "react";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useNavigate } from "react-router-dom";
import { createShortStory } from "../../Api-calls/createShortStory.js";
import { toast } from 'react-toastify';
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Loader2, UploadCloud, X } from "lucide-react"; // Icons for better UX
import { categories } from "../../utils/Categories.jsx";

const CreatePost = () => {
    const navigate = useNavigate();

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

    // UI State
    const [loading, setLoading] = useState(false);
    const [step, setStep] = useState(1);

    /* ================= PREVENT ACCIDENTAL CLOSE ================= */
    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (title || story || coverImg) {
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
        ],
        content: "",
        onUpdate: ({ editor }) => {
            setStory(editor.getHTML());
        },
    });

    /* ================= IMAGE HANDLER ================= */
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setCoverImg(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const removeImage = (e) => {
        e.preventDefault();
        setCoverImg(null);
        setPreviewUrl(null);
    };

    /* ================= SUBMIT ================= */
    const handleSave = async (e) => {
        e.preventDefault();

        if (!title.trim() || !story.trim()) return toast.error("Title and story content are required");
        if (!coverImg) return toast.error("Cover image is required");

        try {
            setLoading(true);
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", genre);
            formData.append("description", description);
            formData.append("finalQuestion", finalQ);
            formData.append("finalAnswer", finalA);
            formData.append("status", status);
            formData.append("story", story);
            formData.append("coverImage", coverImg);

            const result = await createShortStory(formData);

            if (result?.success) {
                toast.success("Story created! +30 XP Reward 🌟");
                // Reset form
                setTitle("");
                setStory("");
                setCoverImg(null);
                setPreviewUrl(null);
                navigate("/home");
            } else {
                toast.error(result?.message || "Failed to create story");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen border-black/70 border bg-gradient-to-b from-[#0f2a24] via-[#0b1412] to-black text-gray-200 pb-16">

            <div className="max-w-5xl mx-auto mt-6 sm:mt-10 bg-[#141a18] rounded-2xl sm:rounded-3xl shadow-xl border border-white/10 p-4 sm:p-6 md:p-8">

                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-200">
                        Write Your Story
                    </h1>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 text-sm bg-[#005c48] text-white font-bold border border-white/20 rounded-lg cursor-pointer hover:bg-[#004d3d] transition"
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
                            disabled={!title || !story} // Disable step 2 until step 1 is started
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
                                className="field-input text-lg font-semibold"
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
                                className="px-8 py-3 rounded-xl bg-emerald-700 text-white font-semibold hover:bg-emerald-600 transition"
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
                                        className="field-input"
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
                                        className="field-input resize-none"
                                        placeholder="What is this story about?"
                                    />
                                </Field>

                                <Field label="Question for Readers to Solve">
                                    <input
                                        value={finalQ}
                                        onChange={(e) => setFinalQ(e.target.value)}
                                        className="field-input"
                                        placeholder="e.g. Who was the killer?"
                                    />
                                </Field>

                                <Field label="Answer / Hidden Summary">
                                    <textarea
                                        value={finalA}
                                        onChange={(e) => setFinalA(e.target.value)}
                                        rows={3}
                                        className="field-input resize-none"
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
                                            <button
                                                onClick={removeImage}
                                                className="absolute top-2 right-2 bg-black/60 p-2 rounded-full hover:bg-red-500/80 transition text-white"
                                            >
                                                <X size={16} />
                                            </button>
                                        </>
                                    ) : (
                                        <div className="text-center p-6">
                                            <UploadCloud size={48} className="mx-auto text-gray-500 mb-3" />
                                            <p className="text-gray-300 font-medium">Click to upload cover</p>
                                            <p className="text-gray-500 text-xs mt-1">PNG, JPG up to 5MB</p>
                                        </div>
                                    )}
                                    <input type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                                </label>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mt-10 pt-6 border-t border-white/10">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-2 rounded-lg text-gray-400 hover:text-white transition font-medium"
                            >
                                ← Back to Story
                            </button>

                            <button
                                onClick={handleSave}
                                disabled={loading}
                                className={`
                                    px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2
                                    transition-all active:scale-95
                                    ${loading ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-600 hover:bg-emerald-500 hover:shadow-emerald-500/20"}
                                `}
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : null}
                                {loading ? "Saving..." : "Publish Story"}
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