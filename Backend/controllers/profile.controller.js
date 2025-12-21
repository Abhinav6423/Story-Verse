import Userstats from "../modals/Userstats.modal.js";
import ShortStory from "../modals/Shortstory.modal.js";

const getUserProfileData = async (req, res) => {
    try {
        const userId = req.user._id

        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const userStats = await Userstats.findOne({ userId })

        if (!userStats) {
            return res.status(404).json({
                success: false,
                message: "User stats not found"
            })
        }

        return res.status(200).json({
            success: true,
            data: userStats
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

const getUserShortStories = async (req, res) => {
    try {
        const userId = req.user._id
        const { status, title, category } = req.query
        if (!userId) {
            return res.status(400).json({
                success: false,
                message: "Unauthorized"
            })
        }

        const filter = { author: userId }
        if (status) {
            filter.status = status
        }

        const stories = await ShortStory.find(filter)

        return res.status(200).json({
            success: true,
            data: stories
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        })
    }
}

export { getUserProfileData , getUserShortStories }