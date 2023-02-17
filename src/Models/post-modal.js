import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, required: true, ref: 'user' },
        image: String,
        content: String,
        likes: [],
        comments: [
            {
                text: {
                    type : String,
                    required: true,
                },
                userId: {
                    type: mongoose.Schema.Types.ObjectId,
                    required: true,
                    ref: 'user'
                }
            }
        ]
    },
    {
        timestamps: true
    })

const postModal = mongoose.model('post', postSchema)
export default postModal;