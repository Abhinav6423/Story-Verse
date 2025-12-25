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

    /* ================= EDITOR ================= */
    const editor = useEditor({
        extensions: [StarterKit],
        content: "<p>Start writing your story...</p>",
        onUpdate: ({ editor }) => {
            setStory(editor.getHTML()); // ✅ STORE STORY
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
            <Navbar />

            <div className="max-w-5xl mx-auto mt-10 bg-white rounded-3xl shadow-lg border border-gray-200 p-8">

                {/* Header */}
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">
                        Create New Blog Article
                    </h1>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="px-4 py-2 text-sm border border-gray-300 rounded-lg"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Publish</option>
                    </select>
                </div>

                {/* Title */}
                <Field label="Title">
                    <input
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Enter blog title..."
                        className="field-input"
                    />
                </Field>

                {/* Genre */}
                <Field label="Genre">
                    <select
                        value={genre}
                        onChange={(e) => setGenre(e.target.value)}
                        className="field-input"
                    >
                        <option value="">Choose genre...</option>
                        <option value="thriller">Thriller</option>
                        <option value="horror">Horror</option>
                        <option value="Technology">Technology</option>
                        <option value="Lifestyle">Lifestyle</option>
                        <option value="Documentation">Documentation</option>
                    </select>
                </Field>

                {/* Description */}
                <Field label="Short Description">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={3}
                        className="field-input"
                    />
                </Field>

                {/* Cover Image */}
                <Field label="Cover Image URL">
                    <input
                        value={coverImg}
                        onChange={(e) => setCoverImg(e.target.value)}
                        className="field-input"
                    />
                </Field>

                {/* Final Question */}
                <Field label="Final Question">
                    <input
                        value={finalQ}
                        onChange={(e) => setFinalQ(e.target.value)}
                        className="field-input"
                    />
                </Field>

                {/* Final Answer */}
                <Field label="Final Answer / Summary">
                    <textarea
                        value={finalA}
                        onChange={(e) => setFinalA(e.target.value)}
                        rows={3}
                        className="field-input"
                    />
                </Field>

                {/* Editor */}
                <div className="mb-10">
                    <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Blog Content
                    </label>

                    <div className="rounded-xl overflow-hidden ">
                        <RichTextEditor editor={editor}>
                            <RichTextEditor.Toolbar sticky >
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

                            <RichTextEditor.Content />
                        </RichTextEditor>
                    </div>
                </div>

                {/* Save */}
                <button
                    onClick={(e) => handleSave(e)}
                    className="
            px-6 py-3 rounded-xl text-slate-200 
            bg-red-500
            shadow-md hover:opacity-90 transition
          "
                >
                    <span className="font-semibold tracking-tight">Save Article</span>
                </button>
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
