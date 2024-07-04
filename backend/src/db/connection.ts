import mongoose from "mongoose";

const MongoDB_URL = process.env.MONGODB_URL || "mongodb+srv://admin:qwe@newcluster.go701p9.mongodb.net/main?retryWrites=true&w=majority&appName=NewCluster"


async function connectToDatabase() {
    try {
        await mongoose.connect(MongoDB_URL);
        console.log("Connected to MongoDB...")
    } catch (error) {
        console.log(error);
        throw new Error("Can not connect to MongoDB");
    }
}

export { connectToDatabase };