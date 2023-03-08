import express from "express";
import {authenticate, loginUser, logOut, newRegister, refreshToken} from "../Controllers/auth-controller.js";
import authMiddleware from "../middlewares/auth.js";
const router = express.Router()

router.post('/register', newRegister)
router.post('/login', loginUser)
router.get('/authenticate', authenticate)
router.get('/refresh', refreshToken)
router.post('/logout', logOut)

export default router