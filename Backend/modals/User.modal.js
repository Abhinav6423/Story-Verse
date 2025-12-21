import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
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
        profilePic: {
            type: String,
            default: ""
        },

    }, { timestamps: true }
)


// password hashing before saving to database

userSchema.pre("save", async function () {
    if (!this.isModified("password")) return;
    this.password = await bcrypt.hash(this.password, 10);
    return;
})


// password check if correct or not on login 
userSchema.methods.isPasswordCorrect = async function (password) {
    return bcrypt.compare(password, this.password);
}


// token generation
userSchema.methods.generateToken = function () {
    return jwt.sign(
        {
            id: this._id
        }
        , process.env.JWT_SECRET
        , {
            expiresIn: "1d"
        }
    )
}


const User = mongoose.model("User", userSchema)
export default User