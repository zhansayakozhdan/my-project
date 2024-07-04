import mongoose from "mongoose";
import passport from "passport";

const chatSchema = new mongoose.Schema({
    role: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    }
});

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    chats: [ chatSchema ]
});


export default mongoose.model("User", userSchema);