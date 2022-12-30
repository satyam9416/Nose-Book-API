import express from "express";
import {getUser, updateUser, followUser, deleteUser, getUserPosts} from "../Controllers/user-controller.js";
const router = express.Router()

router.get('/:id', getUser)
router.put('/:id', updateUser)
router.put('/follow/:id', followUser)
router.delete('/:id', deleteUser)
router.get('/posts/:id', getUserPosts)

export default router