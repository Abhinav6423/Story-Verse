import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    // 🔥 Firebase UID
    firebaseUid: {
      type: String,
      unique: true,
      sparse: true,
    },

    // 🔥 OPTIONAL (Firebase users)
    password: {
      type: String,
      required: false,
      select: false,
    },

    profilePic: {
      type: String,
      default:
        "https://cdn-icons-png.flaticon.com/512/149/149071.png",
    },
  },
  { timestamps: true }
);

/* ================= PASSWORD HASH ================= */
// ✅ CORRECT ASYNC HOOK (NO next)
userSchema.pre("save", async function () {
  // Firebase users → no password
  if (!this.password) return;

  // Password not changed
  if (!this.isModified("password")) return;

  this.password = await bcrypt.hash(this.password, 10);
});

/* ================= PASSWORD CHECK ================= */
userSchema.methods.isPasswordCorrect = async function (password) {
  if (!this.password) return false;
  return bcrypt.compare(password, this.password);
};

/* ================= JWT ================= */
userSchema.methods.generateToken = function () {
  return jwt.sign(
    { id: this._id },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model("User", userSchema);
export default User;


