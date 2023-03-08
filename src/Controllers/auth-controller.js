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

            const accessToken = jwt.sign({
                id: user._id
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" })

            res.status(200).cookie('token', token, {
                sameSite: "none",
                secure: true,
                httpOnly: true,
                maxAge: 10 * 24 * 60 * 60 * 1000
            }).json({ ...newUser, accessToken })


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

                const accessToken = jwt.sign({
                    id: user._id
                }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" })

                res.status(200).cookie('token', token, {
                    sameSite: "none",
                    secure: true,
                    httpOnly: true,
                    maxAge: 10 * 24 * 60 * 60 * 1000
                }).json({ ...user._doc, accessToken })
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

    if(!token) return res.status(401).json({message: 'No Token provided'});

    jwt.verify(token, process.env.JWT_SECRET, async(err, data) => {

        if(err) return res.status(403).json({message: 'Unable to verify token'})
        try {
            const user = await userModal.findById(data.id)
            const accessToken = jwt.sign({
                id: user._id
            }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "30m" })
            res.status(200).send({ ...user._doc, accessToken })
        } catch (error) {
            res.status(500).send(error)
        }
    })

}

export const refreshToken = async(req, res) => {

    const { token } = req.cookies;

    if(!token) return res.status(401).json({message: 'No Token provided'});

    jwt.verify(token, process.env.JWT_SECRET, async(err, data) => {

        if(err) return res.status(403).json({message: 'Unable to verify token'});

        try {
            const user = await userModal.exists({_id: data.id})
            if(!user) return res.status(404).json({message: 'User does not exist'})
            const accessToken = jwt.sign({
                id: data.id
            }, process.env.ACCESS_TOKEN_SECRET, {expiresIn: "30m"})

            return res.status(200).send({accessToken})
        } catch (error) {
            return res.status(500).send({error})
        }
    })

}

// U S E R  L O G O U T
export const logOut = async (req, res) => {
    req.cookies.token ? res.status(200).clearCookie("token", {
        secure : 'true', 
        sameSite: 'none',
        path: '/'
    }).send('User logged out successfully') : res.status(402).send(false)
}