import express from "express";
import {authenticate, loginUser, logOut, newRegister} from "../Controllers/auth-controller.js";
const router = express.Router()

router.post('/register', newRegister)
router.post('/login', loginUser)
router.get('/authenticate', authenticate)
router.post('/logout', logOut)

export default router