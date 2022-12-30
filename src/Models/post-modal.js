import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: { type: String, required: true },
        image: String,
        content: String,
        likes: [],
    },
    {
        timestamps: true
    })

const postModal = mongoose.model('post', postSchema)
export default postModal;