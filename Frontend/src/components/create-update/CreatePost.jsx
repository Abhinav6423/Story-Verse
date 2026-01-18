import React, { useState, useEffect } from "react";
import Navbar from "../Home/Navbar.jsx";
import "@mantine/core/styles.css";
import "@mantine/tiptap/styles.css";
import { useNavigate } from "react-router-dom";
import { createShortStory } from "../../Api-calls/createShortStory.js";
import { toast } from 'react-toastify'
import { RichTextEditor } from "@mantine/tiptap";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Loader from "../Loader.jsx";
import { categories } from "../../utils/Categories.jsx";
import Link from "@tiptap/extension-link";

const CreatePost = () => {
    const navigate = useNavigate();

    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [coverImg, setCoverImg] = useState(null);
    const [finalQ, setFinalQ] = useState("");
    const [finalA, setFinalA] = useState("");
    const [status, setStatus] = useState("draft");
    const [story, setStory] = useState("");
    const [loading, setLoading] = useState(false)
    const [step, setStep] = useState(1)

    /* ================= EDfirst================= */
    const editor = useEditor({
        extensions: [
            StarterKit.configure({
                link: false, // ❌ disables link feature completely
            }),
        ],
        content: "",
        onUpdate: ({ editor }) => {
            setStory(editor.getHTML());
        },
    });


    /* ================= SUBMIT ================= */
    const handleSave = async (e) => {
        e.preventDefault();
        if (!title || !story) {
            toast.error("Title and story content are required");
            return;
        }

        if (!coverImg) {
            toast.error("Cover image is required");
            return;
        }


        try {
            setLoading(true)
            const formData = new FormData();
            formData.append("title", title);
            formData.append("category", genre);
            formData.append("description", description);
            formData.append("finalQuestion", finalQ);
            formData.append("finalAnswer", finalA);
            formData.append("status", status);
            formData.append("story", story);
            formData.append("coverImage", coverImg); // 👈 FILE

            const result = await createShortStory(formData);


            if (result?.success) {
                toast.success("Story created successfully, you recieved reward of 30 xp points ");
                setTitle("");
                setStory("");
                setDescription("");
                setCoverImg(null);
                setFinalQ("");
                setFinalA("");
                setStatus("draft");
                navigate("/home");
            } else {
                toast.error(result?.message || "Failed to create story");
            }
        } catch (error) {
            console.error(error);
            toast.error("Something went wrong");
        } finally {
            setLoading(false)
        }
    };

    if (loading) return <Loader />

    return (
        <div className="min-h-screen border-black/70 border  bg-gradient-to-b from-[#0f2a24] via-[#0b1412] to-black text-gray-200 pb-16">


            <div
                className="
        max-w-5xl mx-auto mt-6 sm:mt-10
          bg-[#141a18] rounded-2xl sm:rounded-3xl
          shadow-xl border border-white/10
          p-4 sm:p-6 md:p-8

      "
            >
                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8">
                    {/* Centered Title */}
                    <div className="flex justify-center">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-200 text-center">
                            Write Your Story
                        </h1>
                    </div>

                    {/* Status Selector */}
                    <div className="flex justify-end mt-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="
                px-3 py-2 sm:px-4 text-sm
                bg-[#005c48] text-white font-bold
                border border-white/20 rounded-lg
              "
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Publish</option>
                        </select>
                    </div>
                </div>

                {/* <div className="border-b border-gray-200 mb-6 sm:mb-8" /> */}


                {/* ================= STEP INDICATOR ================= */}

                <div className="mb-12">
                    {/* Steps */}
                    <div className="flex items-center justify-between max-w-sm mx-auto mb-4">
                        <div
                            className={`
        px-6 py-2 rounded-full text-sm font-semibold
        transition-all
        ${step === 1
                                    ? "bg-emerald-600/25 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                                    : "bg-white/5 text-gray-400 border border-white/10"}
      `}
                        >
                            Step 1
                        </div>

                        <div
                            className={`
        px-6 py-2 rounded-full text-sm font-semibold
        transition-all
        ${step === 2
                                    ? "bg-emerald-600/25 text-emerald-300 border border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.35)]"
                                    : "bg-white/5 text-gray-400 border border-white/10"}
      `}
                        >
                            Step 2
                        </div>
                    </div>

                    {/* Progress Line */}
                    <div className="relative max-w-sm mx-auto">
                        {/* Base line */}
                        <div className="h-[4px] bg-white/10 rounded-full" />

                        {/* Active line */}
                        <div
                            className={`
        absolute top-0 left-0 h-[4px] rounded-full
        bg-emerald-500
        shadow-[0_0_10px_rgba(16,185,129,0.6)]
        transition-all duration-300
        ${step === 1 ? "w-1/2" : "w-full"}
      `}
                        />
                    </div>
                </div>



                {/* ================= STEP 1 ================= */}
                {step === 1 && (
                    <>
                        {/* Editor Header */}
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                                Step 1
                            </span>
                            <h2 className="text-base sm:text-lg font-semibold text-gray-200">
                                Story Content
                            </h2>
                        </div>

                        <div className="border-b mb-4 sm:mb-6" />

                        {/* ================= EDITOR ================= */}
                        <div className="blog-editor">
                            <RichTextEditor
                                editor={editor}
                                styles={{
                                    root: {
                                        borderRadius: "16px",
                                    },
                                    content: {
                                        minHeight: 320,
                                        fontSize: "15px",
                                        lineHeight: "1.7",
                                        padding: "16px",
                                    },
                                }}
                            >
                                {/* TOP TOOLBAR STRIP */}
                                <RichTextEditor.Toolbar sticky>
                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Bold />
                                        <RichTextEditor.Italic />
                                        <RichTextEditor.Strikethrough />
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
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Blockquote />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Undo />
                                        <RichTextEditor.Redo />
                                    </RichTextEditor.ControlsGroup>
                                </RichTextEditor.Toolbar>

                                {/* WRITING AREA */}
                                <RichTextEditor.Content />
                            </RichTextEditor>
                        </div>


                        <Field label="Title of the Story">
                            <textarea
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                rows={1}
                                className="field-input"
                            />
                        </Field>

                        {/* Step Action */}
                        <div className="flex justify-end mt-6 sm:mt-8">
                            <button
                                onClick={() => setStep(2)}
                                className="
                w-full sm:w-auto
                px-6 py-3 rounded-xl 
                bg-green-700 text-white font-semibold
                hover:opacity-90
              "
                            >
                                Next Step
                            </button>
                        </div>
                    </>
                )}

                {/* ================= STEP 2 ================= */}
                {step === 2 && (
                    <>
                        {/* Editor Header */}
                        <div className="flex items-center gap-3 mb-4 sm:mb-6">
                            <span className="text-xs font-medium px-3 py-1 rounded-full bg-green-100 text-green-700">
                                Step 2
                            </span>
                            <h2 className="text-base sm:text-lg font-semibold text-gray-200">
                                Story Details
                            </h2>
                        </div>

                        <div className="border-b mb-4 sm:mb-6" />

                        <Field label="Genre">
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="field-input"
                            >
                                <option disabled value="">
                                    Select Genre
                                </option>
                                {categories.map((cat) => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Short Description">
                            <textarea
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                rows={3}
                                className="field-input"
                            />
                        </Field>

                        <Field label="Cover Image">
                            <label
                                className="
      block w-full cursor-pointer
      rounded-xl border border-dashed
      border-emerald-500/40
      bg-[#0b1412]
      px-4 py-3
      text-sm
      hover:border-emerald-400
      hover:bg-emerald-500/5
      transition
    "
                            >
                                <span className="block text-center text-emerald-400">
                                    {coverImg ? coverImg.name : "Upload image"}
                                </span>

                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setCoverImg(e.target.files[0])}
                                    className="hidden"
                                />
                            </label>
                        </Field>




                        <Field label="Final Question">
                            <input
                                value={finalQ}
                                onChange={(e) => setFinalQ(e.target.value)}
                                className="field-input"
                            />
                        </Field>

                        <Field label="Final Answer / Summary">
                            <textarea
                                value={finalA}
                                onChange={(e) => setFinalA(e.target.value)}
                                rows={3}
                                className="field-input"
                            />
                        </Field>

                        <div className="flex flex-col sm:flex-row justify-between gap-4 mt-8">
                            <button
                                onClick={() => setStep(1)}
                                className="
                w-full sm:w-auto
                px-6 py-3 rounded-xl 
                bg-gray-200 text-gray-800 font-medium
              "
                            >
                                ← Back
                            </button>

                            <button
                                onClick={handleSave}
                                className="
                w-full sm:w-auto
                px-6 py-3 rounded-xl 
                bg-green-700 text-white font-semibold 
                hover:opacity-90
              "
                            >
                                Save Story
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );



};

const Field = ({ label, children }) => (
    <div className="mb-6">
        <label className="text-sm font-medium text-gray-200">{label}</label>
        <div className="mt-2">{children}</div>
    </div>
);

export default CreatePost;
