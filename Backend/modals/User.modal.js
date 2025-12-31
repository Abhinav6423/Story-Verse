import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            trim: true,
        },

        email: {
            type: String,
            required: true,
            unique: true,
            lowercase: true,
        },

        provider: {
            type: String,
            enum: ["local", "google"],
            default: "local",
        },

        // 🔐 password only for local users
        password: {
            type: String,
            required: function () {
                return this.provider === "local";
            },
        },

        emailVerified: {
            type: Boolean,
            default: true, // Google users are already verified
        },

        profilePic: {
            type: String,
            default: "https://cdn-icons-png.flaticon.com/512/149/149071.png",
        },
    },
    { timestamps: true }
);

/* ---------------- PASSWORD HASH ---------------- */
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    if (this.password) {
        this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

/* ---------------- PASSWORD CHECK ---------------- */
userSchema.methods.isPasswordCorrect = async function (password) {
    if (!this.password) return false;
    return bcrypt.compare(password, this.password);
};

/* ---------------- JWT TOKEN ---------------- */
userSchema.methods.generateToken = function () {
    return jwt.sign(
        { id: this._id },
        process.env.JWT_SECRET,
        { expiresIn: "1d" }
    );
};

const User = mongoose.model("User", userSchema);
export default User;
