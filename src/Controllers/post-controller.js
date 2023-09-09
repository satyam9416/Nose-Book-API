import mongoose from "mongoose";
import postModal from "../Models/post-modal.js";
import userModal from "../Models/user-modal.js";

//  NEW POST
export const newPost = async (req, res) => {
    const post = new postModal(req.body)
    try {
        await post.save()
        res.status(200).json(post)
    } catch (error) {
        res.status(500).send(error.message)
    }
}

// GET POST
export const getPost = async (req, res) => {
    const postId = req.params.id
    try {
        const post = await postModal.findById(postId)
        res.status(200).json(post)
    } catch (error) {
        res.status(500).json(error)
    }
}

// UPDATE POST
export const updatePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body
    try {
        const prevPost = await postModal.findById(postId)
        if (prevPost.userId == userId) {
            await prevPost.updateOne({ $set: req.body })
            res.status(200).send('post updated')
        } else if (prevPost.userId !== userId) {
            res.status(400).send('Accress Denied')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

//  DELETE POST
export const deletePost = async (req, res) => {
    try {
        await postModal.deleteOne({ _id: mongoose.Types.ObjectId(req.params.id) })
        res.status(200).send('Post Deleted !')
    } catch (error) {
        res.status(500).json(error)
    }
}

//Like post
export const likePost = async (req, res) => {
    const postId = req.params.id
    const { userId } = req.body
    try {
        const post = await postModal.findById(postId)
        if (!post._doc.likes.includes(userId)) {
            await post.updateOne({
                $push: { likes: userId }
            })
            res.status(200).send('Post Liked')
        }
        else if (post.likes.includes(userId)) {
            await post.updateOne({
                $pull: { likes: userId }
            })
            res.status(200).send('Post Disliked')
        }
    } catch (error) {
        res.status(500).json(error)
    }
}


// GET TIMELINE POSTS
export const getTimelinePosts = async (req, res) => {
    const userId = req.params.id
    try {
        let userPosts = await postModal.find({ userId })
        const user = await userModal.findById(userId)
        for (let i = 0; i < user.followings.length; i++) {
            let id = user.followings[i]
            let posts = await postModal.find({ userId: id })
            userPosts.push(...posts)
        }
        res.status(200).send(userPosts.sort((a, b) => b.createdAt - a.createdAt))
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const commentOnPost = async(req, res) => {
    const { postId } = req.params
    const { comment} = req.body;

    try {
        let post = await postModal.findById(postId)

        if(!post) {
            return res.status(404).json({message: 'post not found', isError: true, error: 'post not found'})
        }

        post.comments.push({text: comment, userId :req.auth.id})
        await post.save()
        
        return res.json({post, message: 'success', isError: false})
    } catch (error) {
        res.status(500).json(error)        
    }


}

