import mongoose from "mongoose"

const messageSchema = new mongoose.Schema({
    senderId : String,
    recieverId: String,
    msg: String
},{
    timestamps: { createdAt: 'sentAt', updatedAt: false }
})

const chatSchema = new mongoose.Schema({
    members : [],
    messages: [messageSchema]
},{
    timestamps : true
})

const chatModal = mongoose.model('chats', chatSchema)

export default chatModal;