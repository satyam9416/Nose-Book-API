import express from "express";
import multer from 'multer'
const router = express.Router()

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images')
    },
    filename: (req, file, cb) => {
        cb(null, req.body.filename)
    }
})
// Date.now() + file.originalname
const upload = multer({ storage: storage })

router.post('/image', upload.single('file'), (req, res) => {
    res.status(200).send(`${req.file.filename} uploaded successfully`)
})

export default router;