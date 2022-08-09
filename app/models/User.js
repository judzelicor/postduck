import mongoose from "mongoose";

const Schema =  mongoose.Schema;

const UserSchema = new Schema({
    firstName: {
        type: String,
        required: true,
    },

    lastName: {
        type: String,
        required: true,
    },

    username: {
        type: String,
        minLength: 5,
        maxLength: 16,
        required: true,
        unique: true
    },

    email: {
        type: String,
        required: true,
        unique: true
    },

    password: {
        type: String,
        required: true
    },
    
    profilePicture: {
        type: String,
        default: "/images/sample.jpg",
        required: false
    },

    following: [{ 
        type: Schema.Types.ObjectId, 
        ref: "User",
    }],

    followers: [{ 
        type: Schema.Types.ObjectId, 
        ref: "User",
    }],

    accountIsVerified: {
        type: Boolean,
        default: false,
        required: false
    },

}, { timestamps: true });

const User = mongoose.model("User", UserSchema)

export default User;