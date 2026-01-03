import React, { useEffect, useState } from "react";
import { RichTextEditor } from "@mantine/tiptap";
import { useParams, useNavigate } from "react-router-dom";
import { openUserShortStory } from "../../Api-calls/openUserShortStories.js";
import { updateShortStory } from "../../Api-calls/updateShortStory.js";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { toast } from "react-toastify";
import { categories } from "../../utils/Categories.jsx";
import Loader from "../Loader.jsx";
import Link from "@tiptap/extension-link";

const UpdateShortStory = () => {
    const navigate = useNavigate();
    const { storyId } = useParams();
    const [title, setTitle] = useState("");
    const [genre, setGenre] = useState("");
    const [description, setDescription] = useState("");
    const [coverImg, setCoverImg] = useState("");
    const [finalQ, setFinalQ] = useState("");
    const [finalA, setFinalA] = useState("");
    const [status, setStatus] = useState("draft");
    const [story, setStory] = useState("");
    const [loading, setLoading] = useState(true);
    const [step, setStep] = useState(1);
    const [contentLoaded, setContentLoaded] = useState(false);


    /* ================= EDITOR ================= */
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

    /* ================= FETCH STORY ================= */
    useEffect(() => {
        if (!editor || !storyId) return;

        const fetchShortStory = async () => {
            try {
                const result = await openUserShortStory({ storyId });

                if (!result?.success) {
                    toast.error(result?.message || "Failed to load story");
                    return;
                }

                const data = result.data;
                // console.log(data)
                setTitle(data.title || "");
                setGenre(data.category || "");
                setDescription(data.description || "");
                setCoverImg(data.coverImage || "");
                setFinalQ(data.finalQuestion || "");
                setFinalA(data.finalAnswer || "");
                setStatus(data.status || "draft");
                setStory(data.story || "");

                // ✅ SET CONTENT ONLY ONCE
                if (!contentLoaded) {
                    editor.commands.setContent(data.story || "");
                    setContentLoaded(true);
                }
            } catch (error) {
                console.error(error);
                toast.error("Failed to load story");
            } finally {
                setLoading(false);
            }
        };

        fetchShortStory();
    }, [editor, storyId, contentLoaded]);

    /* ================= SUBMIT ================= */
    const handleSave = async () => {
        if (!title || !story || !genre || !description || !finalQ || !finalA || !status) {
            toast.error("All fields are required");
            return;
        }

        try {
            setLoading(true);

            const result = await updateShortStory({
                storyId,
                title,
                category: genre,
                description,
                coverImage: coverImg,
                finalQuestion: finalQ,
                finalAnswer: finalA,
                status,
                story,
            });

            if (result?.success) {
                toast.success("Story updated successfully");
                navigate("/home");
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

    if (!editor || loading) return <Loader />;

    return (
        <div className="min-h-screen bg-[#eef1f6] pb-16">
            <div className="max-w-5xl mx-auto mt-6 bg-white rounded-2xl shadow-lg p-6">

                {/* HEADER */}
                <div className="flex justify-between mb-6">
                    <h1 className="text-2xl font-semibold">Update Story</h1>

                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border rounded-lg px-3 py-2"
                    >
                        <option value="draft">Draft</option>
                        <option value="published">Publish</option>
                    </select>
                </div>

                {/* STEP INDICATOR */}
                <div className="flex gap-3 mb-6">
                    <span className={`px-4 py-2 rounded-full text-sm ${step === 1 ? "bg-green-700 text-white" : "bg-gray-200"}`}>
                        Step 1
                    </span>
                    <span className={`px-4 py-2 rounded-full text-sm ${step === 2 ? "bg-green-700 text-white" : "bg-gray-200"}`}>
                        Step 2
                    </span>
                </div>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <RichTextEditor editor={editor}>
                            <RichTextEditor.Toolbar sticky>
                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Bold />
                                    <RichTextEditor.Italic />
                                    <RichTextEditor.Strikethrough />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.H1 />
                                    <RichTextEditor.H2 />
                                    <RichTextEditor.BulletList />
                                    <RichTextEditor.OrderedList />
                                </RichTextEditor.ControlsGroup>

                                <RichTextEditor.ControlsGroup>
                                    <RichTextEditor.Undo />
                                    <RichTextEditor.Redo />
                                </RichTextEditor.ControlsGroup>
                            </RichTextEditor.Toolbar>

                            <RichTextEditor.Content />
                        </RichTextEditor>

                        <Field label="Title">
                            <input
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                className="field-input"
                            />
                        </Field>

                        <button
                            onClick={() => setStep(2)}
                            className="mt-6 px-6 py-3 bg-green-700 text-white rounded-xl"
                        >
                            Next
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <Field label="Genre">
                            <select
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="field-input"
                            >
                                <option value="">Select genre</option>
                                {categories.map((cat) => (
                                    <option key={cat.name} value={cat.name}>
                                        {cat.name}
                                    </option>
                                ))}
                            </select>
                        </Field>

                        <Field label="Description">
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

                        <Field label="Final Answer">
                            <textarea
                                value={finalA}
                                onChange={(e) => setFinalA(e.target.value)}
                                rows={3}
                                className="field-input"
                            />
                        </Field>

                        <div className="flex justify-between mt-6">
                            <button
                                onClick={() => setStep(1)}
                                className="px-6 py-3 bg-gray-200 rounded-xl"
                            >
                                ← Back
                            </button>

                            <button
                                onClick={handleSave}
                                className="px-6 py-3 bg-green-700 text-white rounded-xl"
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

export default UpdateShortStory;
