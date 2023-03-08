import userModal from "../Models/user-modal.js";
import bcrypt from 'bcrypt'
import _ from 'lodash'
import postModal from "../Models/post-modal.js";

// get user controller
export const getUser = async (req, res) => {
    const id = req.params.id
    const user = await userModal.findById(id)
    const { passwd, ...otherDetails } = user._doc
    try {
        if (user) {
            res.status(200).json(otherDetails)
        }
        else if (!user) {
            res.status(200).send("User doesn' exist")
        }
    } catch (error) {
        res.status(500).json(error)
    }
}

// Update user controller
export const updateUser = async (req, res) => {
    const id = req.params.id
    let { currentUserId, currentUserAdminStatus, passwd, userName } = req.body
    userName ? req.body.userName = _.capitalize(userName) : 0;
    if (currentUserId === id || currentUserAdminStatus) {
        if (passwd) {
            const salt = await bcrypt.genSalt(10)
            req.body.passwd = await bcrypt.hash(passwd, salt)
        }
        try {
            const user = await userModal.findByIdAndUpdate(id, req.body, { new: true })
            res.status(200).json(user)
        } catch (error) {

            res.status(500).send(error)
        }
    }
    else {
        res.status(403).send('Action forbidden')
    }
}

// Follow user controller
export const followUser = async (req, res) => {
    const id = req.params.id
    const { currentUserid } = req.body
    const followedUser = await userModal.findById(id)
    const followingUser = await userModal.findById(currentUserid)
    let isFollowing = followedUser?.followers.includes(currentUserid)
    if (currentUserid !== id) {
        try {
            if (!isFollowing) {
                await followedUser.updateOne({ $push: { followers: currentUserid } })
                await followingUser.updateOne({ $push: { followings: id } })
                res.status(200).send('User Followed Succesfully !')
            }
            else if (isFollowing) {
                await followedUser.updateOne({ $pull: { followers: currentUserid } })
                await followingUser.updateOne({ $pull: { followings: id } })
                res.status(200).send('User Unfollowed Succesfully !')
            }
        } catch (error) {
            res.status(500).send(error)
        }
    }

    else {
        res.status(403).send('Action forbidden')
    }
}

// delete user controller
export const deleteUser = async (req, res) => {
    const id = req.params.id
    const { currentUserId, currentUserAdminStatus, passwd } = req.body
    if (currentUserId === id || currentUserAdminStatus) {
        try {
            await userModal.findByIdAndDelete(id)
            res.status(200).send('User Deleted Successfully')
        } catch (error) {
            res.status(500).send(error)
        }
    }
    else {
        res.status(403).send('Action forbidden')
    }
}

// GET USER POSTS

export const getUserPosts = async (req, res) => {
    const userId = req.params.id
    try {
        const posts = await postModal.find({ userId })
        posts ?
            res.status(200).send(posts.sort((a, b) => b.createdAt - a.createdAt)) :
            res.status(404).send('No posts found')

    } catch (error) {
        res.status(500).send(error.message)
    }
}