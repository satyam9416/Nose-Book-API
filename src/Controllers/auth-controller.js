import userModal from "../Models/user-modal.js";
import bcrypt from 'bcrypt'
import 'dotenv/config'
import _ from 'lodash'
import jwt from 'jsonwebtoken'

// new user register controller
export const newRegister = async (req, res) => {
    let { fName, lName, userName, passwd } = req.body;
    userName = _.capitalize(userName)
    const oldUser = await userModal.find({ userName })
    if (!oldUser?.length) {
        const salt = await bcrypt.genSalt(10)
        const hashedPasswd = await bcrypt.hash(passwd, salt)
        const newUser = new userModal({ fName, lName, userName, passwd: hashedPasswd })
        try {
            const user = await newUser.save()
            const token = jwt.sign({
                id: user._id
            }, process.env.JWT_SECRET)

            res.status(200).json(newUser)


        } catch (error) {
            res.status(500).json({ message: error.message })
        }
    }
    else if (oldUser?.length) {
        res.status(400).json({ oldUser: oldUser })
    }
    else {
        res.status(500).json({ message: 'Something went wrong' })
    }
}
// user login controller
export const loginUser = (req, res) => {
    let { userName, passwd } = req.body
    userName = _.capitalize(userName)
    userModal.findOne({ userName }, async (err, user) => {
        if (user) {
            const validity = await bcrypt.compare(passwd, user.passwd)
            if (validity) {
                const token = jwt.sign({
                    id: user._id
                }, process.env.JWT_SECRET)
                res.status(200).cookie('token', token, {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true
                }).send(user)
            }
            else {
                res.status(404).send('Wrong password')
            }

        }
        else {
            res.status(404).send("User doesn't exist")
        }
    })

}

// U S E R  A U T H E N T I C A T I O N 
export const authenticate = async (req, res) => {
    const { token } = req.cookies;
    let data = false
    if (token) {
        data = jwt.verify(token, process.env.JWT_SECRET)
    }
    if (data) {
        try {
            const user = await userModal.findById(data.id)
            res.status(200).send(user)
        } catch (error) {
            res.status(500).send(error)
        }
    }
    else {
        res.status(401).send(data)
    }
}

// U S E R  L O G O U T
export const logOut = async (req, res) => {
    console.log('cookies : ', req.cookies)
    req.cookies.token ? res.status(200).clearCookie("token", {
        secure : 'true', 
        sameSite: 'none',
        path: '/'
    }).send('User logged out successfully') : res.status(402).send(false)
}