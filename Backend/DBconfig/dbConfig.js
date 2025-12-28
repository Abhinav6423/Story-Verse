import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const connectionInstance = await mongoose.connect(process.env.MONGO_URI);
        console.log(`✅ Connected to DB ${connectionInstance.connection.host}`);
    } catch (error) {
        console.error("❌ MongoDB connection failed", error);
        throw error; // 👈 IMPORTANT CHANGE
    }
};

export default connectDB;
