import mongoose from "mongoose";

export const ConnectDB = async () => {
    if (mongoose.connection.readyState >= 1) {
        return;
    }
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log("DB connected");
    } catch (error) {
        console.error("DB connection failed:", error.message);
        throw error;
    }
};