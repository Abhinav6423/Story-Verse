import mongoose, { Schema } from 'mongoose';

const stoReelSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slidesText: [
        {
            type: String,
            required: true
        }
    ],
    reelCover: {
        type: String,
        required: true
    },
    reelStory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ShortStory',
        required: true
    }
})


const StoReel = mongoose.model('StoReel', stoReelSchema);

export default StoReel;