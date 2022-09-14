import chatModal from "../Models/chat-modal.js";

export const createNewChat = async (chat) => {
    const { senderId, recieverId, msg } = chat
    try {

    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

export const getChats = async (req, res) => {
    const { id } = req.params
    try {
        const chats = await chatModal.find({ members: { $in: id } })
        res.status(200).json(chats)
    } catch (error) {
        console.log(error)
        res.status(500).send(error.message)
    }
}

export const sendMsg = async (req, res) => {
    const { senderId, recieverId, msg } = req.body
    const chat = { senderId, recieverId, msg }
    try {
        const doc = await chatModal.findOneAndUpdate({ members: { $all: [senderId, recieverId] } }, {
            $push: { messages: chat }
        }, { new: true })
        doc && res.status(200).json(doc)
        if (!doc) {
            const newChat = new chatModal({
                members: [senderId, recieverId],
                messages: [{ ...chat }]
            })
            newChat.save().then((docs) => {
                res.status(200).json(docs)
            })
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}