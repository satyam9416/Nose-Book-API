import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    userName: String,
    fName: String,
    lName: String,
    passwd: String,
    status: String,
    profileImg: String,
    coverImg: String,
    phone: Number,
    DOB: Date,
    relationshipStatus: String,
    location: String,
    worksAt: String,
    isAdmin: {
        type: Boolean,
        default: false
    },
    followers: [],
    followings: [],
    posts: [{
        img: String,
        content: String,
        likes: [],
        comments: [{
            userName: String,
            comment: String
        }]
    }]}, 
    {timestamps: true}
    )
const userModal = mongoose.model('user', userSchema)
export default userModal