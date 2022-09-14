import express from "express";
import { getChats, sendMsg } from "../Controllers/chat-controller.js";
const router = express.Router()

router.get('/:id', getChats)
router.post('/send', sendMsg)

export default router