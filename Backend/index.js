import express from "express"
import dotenv from "dotenv"
dotenv.config({
    path: "./.env"
})
import cookieParser from "cookie-parser"
import cors from "cors"
import connectDB from "./DBconfig/dbConfig.js"
const app = express()
const port = process.env.PORT || 5000

connectDB();

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
const allowedOrigins = [
    "http://localhost:5173",
    "https://story-verse.vercel.app" // 👈 replace with your real Vercel domain
];

app.use(cors({
    origin: function (origin, callback) {
        // allow requests with no origin (Postman, mobile apps)
        if (!origin) return callback(null, true);

        if (allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },
    credentials: true
}));

app.use(cookieParser())




//authentication routes initialization
import authenticationRoutes from "./routes/authentication.routes.js"
app.use("/api/auth", authenticationRoutes)

//short-story-routes initialization
import shortStoryRoutes from "./routes/ShortStory.route.js"
app.use("/api/story", shortStoryRoutes)

//user-profile-routes initialization
import userProfileRoutes from "./routes/userProfile.route.js"
app.use("/api/profile", userProfileRoutes)

//testing route
app.get("/", (req, res) => {
    res.send("Server is up and running ✅")
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`)
})