import express from 'express'
import { deletePost, getPost, getTimelinePosts, likePost, newPost, updatePost } from '../Controllers/post-controller.js'
const router = express.Router()


router.post('/new', newPost)
router.get('/:id', getPost)
router.put('/:id', updatePost)
router.delete('/:id', deletePost)
router.put('/like/:id', likePost)
router.get('/timeline/:id', getTimelinePosts)

export default router