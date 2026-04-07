import StoReel from "../modals/stoReel.modal.js"; // Note: Make sure it's .model.js not .modal
import { uploadToCloudinary } from "../utils/cloudinaryUploadFunction.js"


export const createStoReel = async (req, res) => {
    console.log("Hit reel controller🤣🤣")
    try {
        const { title, slidesText, reelStory } = req.body || {};
        const authorId = req.user._id;

        if (!title || !slidesText || !reelStory) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        let parsedSlidesText;
        try {
            parsedSlidesText = typeof slidesText === 'string'
                ? JSON.parse(slidesText)
                : slidesText;
        } catch {
            return res.status(400).json({ message: 'Invalid format for slidesText' });
        }

        const hasEmpty = parsedSlidesText.some(s => !s?.trim());
        if (hasEmpty) {
            return res.status(400).json({ message: "All slides must have content" });
        }

        const reelFile = req.files?.reelCover?.[0];
        console.log("📁 File:", reelFile?.originalname, reelFile?.size);
        if (!reelFile) {
            return res.status(400).json({ message: 'Reel cover image is required' });
        }

        let upload;
        try {
            upload = await uploadToCloudinary(reelFile, "storeel_covers");
            console.log("☁️ Cloudinary result:", upload);
        } catch (cloudErr) {
            console.error("☁️ Cloudinary FAILED:", cloudErr.message);
            return res.status(500).json({ message: `Cloudinary error: ${cloudErr.message}` });
        }

        if (!upload?.url) {
            return res.status(500).json({ message: 'Failed to upload reel cover image' });
        }

        let newStoryReel;
        try {
            newStoryReel = await StoReel.create({
                author: authorId,
                title,
                slidesText: parsedSlidesText,
                reelStory,
                reelCover: upload.url
            });
            console.log("✅ Saved to DB:", newStoryReel._id);
        } catch (dbErr) {
            console.error("🗄️ DB FAILED:", dbErr.message);
            return res.status(500).json({ message: `DB error: ${dbErr.message}` });
        }

        res.status(201).json({
            message: 'StoReel created successfully',
            StoReel: newStoryReel
        });

    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        res.status(500).json({ message: error.message });
    }
};

export const getAllStoReels = async (req, res) => {
    try {
        const userId = req.user._id;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }

        const reels = await StoReel.find().sort({ createdAt: -1 });
        res.status(200).json({ reels });
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        res.status(500).json({ message: error.message });
    }
}

export const getMyStoReels = async (req, res) => {
    try {
        const authorId = req.user._id;
        if (!authorId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const myReels = await StoReel.find({ author: authorId }).sort({ createdAt: -1 });
        res.status(200).json({ message: "success", reels: myReels });
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        res.status(500).json({ message: error.message });
    }
}

export const openStoreel = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Reel ID is required" });
        }

        const reel = await StoReel.findById(id);
        if (!reel) {
            return res.status(404).json({ message: "StoReel not found" });
        }

        res.status(200).json({ message: "success", reel });
    } catch (error) {
        console.error('❌ Unexpected error:', error.message);
        res.status(500).json({ message: error.message });
    }
}



