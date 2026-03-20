// Helper to get ambient gradients based on story category
export const getCategoryGradient = (category) => {
    const cat = category?.toLowerCase() || "";
    console.log(category)

    // We use dark, desaturated colors to keep the text highly readable
    switch (cat) {
        case "horror":
        case "thriller":
            return "from-red-950/40 via-[#050505] to-black";
        case "sci-fi":
        case "science fiction":
            return "from-blue-950/30 via-[#05090f] to-black";
        case "fantasy":
            return "from-indigo-950/30 via-[#0a0514] to-black";
        case "romance":
        case "drama":
            return "from-rose-950/30 via-[#0f0507] to-black";
        case "mystery":
            return "from-slate-800/40 via-[#05090a] to-black";
        default:
            // Your signature Preface dark emerald vibe as the fallback
            return "from-[#152a25] via-[#0b1412] to-[#050908]";
    }
};