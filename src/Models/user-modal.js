import mongoose from "mongoose"
const userSchema = new mongoose.Schema({
    userName: String,
    fName: String,
    lName: String,
    passwd: String,
    status: String,
    profileImg: { type: String, default: '/images/defaultProfile.jpg' },
    coverImg: {type: String, default: '/images/defaultCover.jpg'},
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
    followings: []
},
    { timestamps: true }
)
const userModal = mongoose.model('user', userSchema)
export default userModal