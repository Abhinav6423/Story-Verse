import React, { useState, useEffect } from 'react';
import { UploadCloud, Image as ImageIcon, X, Film, CheckCircle, TableRowsSplit } from 'lucide-react';
import { useParams } from 'react-router-dom';
import { createStoreel } from "../../Api-calls/createStoreel.js"
import { toast } from 'react-toastify';
import imageCompression from 'browser-image-compression';
const StoreelCreate = () => {
    const [title, setTitle] = useState('');
    const [coverPreview, setCoverPreview] = useState(null);
    const [reelCover, setReelCover] = useState(null);
    const [compressing, setCompressing] = useState(false);
    const [submitting, setSubmitting] = useState(false);

    const [slide1, setSlide1] = useState("")
    const [slide2, setSlide2] = useState("")
    const [slide3, setSlide3] = useState("")
    const [slide4, setSlide4] = useState("")
    const [slide5, setSlide5] = useState("")
    const [slide6, setSlide6] = useState("")
    const [slide7, setSlide7] = useState("")
    const [slide8, setSlide8] = useState("")

    const { id: storyid } = useParams();

    useEffect(() => {
        const handleBeforeUnload = (e) => {
            if (title || slide1 || slide2 || slide3 || slide4 || slide5 || slide6 || slide7 || slide8 || reelCover) {
                e.preventDefault();
                e.returnValue = "";
            }
        };
        window.addEventListener("beforeunload", handleBeforeUnload);
        return () => window.removeEventListener("beforeunload", handleBeforeUnload);
    }, [title, slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8, reelCover]);

    const handleImageChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        e.target.value = null;

        if (file.size / 1024 / 1024 < 1.2) {
            setReelCover(file);
            setCoverPreview(URL.createObjectURL(file));
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
            setReelCover(webpFile);
            setCoverPreview(URL.createObjectURL(webpFile));
            toast.success("Image optimized!");
        } catch (error) {
            toast.error("Failed to process image");
        } finally {
            setCompressing(false);
        }
    };

    const removeImage = () => {
        setReelCover(null);
        setCoverPreview(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (compressing) {
            toast.warning("Please wait, image is still being processed...");
            return;
        }
        setSubmitting(true);
        try {
            const result = await createStoreel({
                title,
                slidesText: [slide1, slide2, slide3, slide4, slide5, slide6, slide7, slide8],
                reelStory: storyid,
                reelCover
            });
            if (result.success) {
                toast.success("Reel published successfully!");
            } else {
                toast.error(`Failed: ${result.message}`);
            }
        } catch (error) {
            toast.error("An error occurred while creating the reel.");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0f0d] text-white px-4 pb-4 md:px-8 md:pb-8 pt-28 md:pt-32 font-sans">
            <div className="max-w-6xl mx-auto">

                {/* HEADER */}
                <div className="mb-10 border-b border-white/10 pb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                            Create Story <span className="text-emerald-400">Reel</span>
                        </h1>
                        <p className="text-gray-400 text-sm md:text-base">
                            Craft a captivating 8-slide visual trailer for your story.
                        </p>
                    </div>
                    <div className="hidden sm:flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-xl backdrop-blur-sm">
                        <span className="text-gray-400 text-sm">Status:</span>
                        <div className="flex items-center gap-1.5 text-emerald-400 font-medium">
                            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                            {submitting ? "Publishing..." : compressing ? "Compressing..." : "Drafting"}
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="flex flex-col lg:flex-row gap-10">

                    {/* LEFT COLUMN */}
                    <div className="w-full lg:w-1/3 space-y-8">
                        <div className="space-y-2">
                            <input
                                type="text"
                                placeholder="Enter a captivating reel title..."
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                disabled={submitting}
                                className="w-full bg-transparent border-b border-gray-700 text-2xl font-semibold placeholder:text-gray-600 focus:border-emerald-500 outline-none pb-2 transition-colors duration-300 disabled:opacity-50"
                                required
                            />
                        </div>

                        {/* Cover Upload */}
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-2">
                                <ImageIcon size={14} className="text-emerald-400" />
                                Reel Cover Image (9:16)
                            </label>

                            <div className="relative w-full max-w-[240px] aspect-[9/16] rounded-2xl overflow-hidden border-2 border-dashed border-gray-700 hover:border-emerald-500/50 transition-colors duration-300 group bg-[#111816]">

                                {/* Compressing overlay */}
                                {compressing && (
                                    <div className="absolute inset-0 z-10 bg-black/80 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
                                        <span className="text-xs text-emerald-400 font-medium">Optimizing...</span>
                                    </div>
                                )}

                                {coverPreview ? (
                                    <>
                                        <img src={coverPreview} alt="Cover Preview" className="w-full h-full object-cover" />
                                        {!compressing && (
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 backdrop-blur-sm">
                                                <button
                                                    type="button"
                                                    onClick={removeImage}
                                                    disabled={submitting}
                                                    className="p-2 bg-red-500/20 text-red-400 rounded-full hover:bg-red-500 hover:text-white transition-colors"
                                                >
                                                    <X size={20} />
                                                </button>
                                                <span className="text-xs font-medium tracking-wide">Remove Image</span>
                                            </div>
                                        )}
                                    </>
                                ) : (
                                    !compressing && (
                                        <label className="absolute inset-0 flex flex-col items-center justify-center cursor-pointer text-gray-500 hover:text-emerald-400 transition-colors">
                                            <div className="p-4 rounded-full bg-white/5 mb-3 group-hover:bg-emerald-500/10 group-hover:scale-110 transition-all duration-300">
                                                <UploadCloud size={28} />
                                            </div>
                                            <span className="text-sm font-medium">Click to upload</span>
                                            <span className="text-[10px] mt-1 opacity-70">JPG, PNG (Max 5MB)</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageChange}
                                                className="hidden"
                                                required
                                            />
                                        </label>
                                    )
                                )}
                            </div>

                            {/* Compression status text */}
                            {compressing && (
                                <p className="text-xs text-emerald-400 flex items-center gap-1.5 animate-pulse">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block"></span>
                                    Compressing image for faster upload...
                                </p>
                            )}
                        </div>
                    </div>

                    {/* RIGHT COLUMN */}
                    <div className="w-full lg:w-2/3">
                        <div className="bg-[#111816] border border-white/5 rounded-2xl p-6 shadow-xl">
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-lg font-semibold text-white">Hook Sequence</h3>
                                <span className="text-xs font-bold px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                    8 Slides
                                </span>
                            </div>

                            <div className="space-y-4">
                                {[
                                    { num: "01", val: slide1, set: setSlide1, placeholder: "The opening hook..." },
                                    { num: "02", val: slide2, set: setSlide2, placeholder: "Continue the suspense..." },
                                    { num: "03", val: slide3, set: setSlide3, placeholder: "Build the tension..." },
                                    { num: "04", val: slide4, set: setSlide4, placeholder: "What did they discover?..." },
                                    { num: "05", val: slide5, set: setSlide5, placeholder: "The stakes are raised..." },
                                    { num: "06", val: slide6, set: setSlide6, placeholder: "Almost at the climax..." },
                                    { num: "07", val: slide7, set: setSlide7, placeholder: "The big reveal..." },
                                    { num: "08", val: slide8, set: setSlide8, placeholder: "The final cliffhanger..." },
                                ].map(({ num, val, set, placeholder }, i, arr) => (
                                    <div key={num} className="relative flex items-start gap-4 group">
                                        <div className="flex flex-col items-center mt-1">
                                            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold border transition-colors duration-300 ${val?.trim() ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' : 'bg-white/5 border-white/10 text-gray-500'}`}>
                                                {num}
                                            </div>
                                            {i < arr.length - 1 && (
                                                <div className="w-[1px] h-full bg-white/10 mt-2 absolute top-8 bottom-[-16px]"></div>
                                            )}
                                        </div>
                                        <div className="flex-1">
                                            <input
                                                type="text"
                                                placeholder={placeholder}
                                                value={val || ''}
                                                onChange={(e) => set(e.target.value)}
                                                disabled={submitting}
                                                className="w-full bg-[#0a0f0d] border border-gray-800 rounded-xl p-3.5 text-sm text-gray-200 placeholder:text-gray-600 focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 outline-none transition-all disabled:opacity-50"
                                                required
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="mt-8 flex items-center justify-end border-t border-white/10 pt-6">
                            <button
                                type="submit"
                                disabled={submitting || compressing}
                                className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-400 disabled:bg-emerald-500/50 disabled:cursor-not-allowed text-black px-8 py-3.5 rounded-xl font-bold shadow-[0_0_20px_rgba(16,185,129,0.2)] hover:shadow-[0_0_30px_rgba(16,185,129,0.4)] transition-all transform hover:-translate-y-0.5 active:scale-95 disabled:transform-none min-w-[180px] justify-center"
                            >
                                {submitting ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Publishing...
                                    </>
                                ) : compressing ? (
                                    <>
                                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                                        Compressing...
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle size={18} />
                                        Publish Storeel
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default StoreelCreate;

