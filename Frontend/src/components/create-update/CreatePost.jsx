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
    const [coverImg, setCoverImg] = useState("");
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

        try {
            setLoading(true)
            const result = await createShortStory({
                title,
                category: genre,
                description,
                coverImage: coverImg,
                finalQuestion: finalQ,
                finalAnswer: finalA,
                status,
                story, // ✅ FULL HTML CONTENT
            });

            if (result?.success) {
                toast.success("Story created successfully");
                setTitle("");
                setStory("");
                setDescription("");
                setCoverImg("");
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
        <div className="min-h-screen bg-[#eef1f6] pb-16">


            <div
                className="
        max-w-5xl mx-auto mt-6 sm:mt-10 
        bg-white rounded-2xl sm:rounded-3xl 
        shadow-lg border border-gray-200 
        p-4 sm:p-6 md:p-8
      "
            >
                {/* ================= HEADER ================= */}
                <div className="mb-6 sm:mb-8">
                    {/* Centered Title */}
                    <div className="flex justify-center">
                        <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-gray-900 text-center">
                            Write Story
                        </h1>
                    </div>

                    {/* Status Selector */}
                    <div className="flex justify-end mt-4">
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            className="
              px-3 py-2 sm:px-4 
              text-sm border border-gray-300 rounded-lg
            "
                        >
                            <option value="draft">Draft</option>
                            <option value="published">Publish</option>
                        </select>
                    </div>
                </div>

                <div className="border-b border-gray-200 mb-6 sm:mb-8" />

                {/* ================= STEP INDICATOR ================= */}
                <div className="flex flex-wrap gap-3 mb-8 sm:mb-10">
                    <div
                        className={`px-4 py-2 rounded-full text-sm font-medium 
          ${step === 1 ? "bg-green-700 text-white" : "bg-gray-200 text-gray-600"}`}
                    >
                        Step 01
                    </div>

                    <div
                        className={`px-4 py-2 rounded-full text-sm font-medium 
          ${step === 2 ? "bg-green-700 text-white" : "bg-gray-200 text-gray-600"}`}
                    >
                        Step 02
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
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
                                Story Content
                            </h2>
                        </div>

                        <div className="border-b mb-4 sm:mb-6" />

                        {/* ================= EDITOR ================= */}
                        <div className="flex flex-col">
                            <RichTextEditor
                                editor={editor}
                                styles={{
                                    root: {
                                        "--rte-text-color": "#111827",
                                        "--rte-heading-color": "#111827",
                                    },
                                    content: {
                                        minHeight: 320,        // mobile
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
                            <h2 className="text-base sm:text-lg font-semibold text-gray-900">
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

                        <Field label="Cover Image URL">
                            <input
                                value={coverImg}
                                onChange={(e) => setCoverImg(e.target.value)}
                                className="field-input"
                            />
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
        <label className="text-sm font-medium text-gray-700">{label}</label>
        <div className="mt-2">{children}</div>
    </div>
);

export default CreatePost;
