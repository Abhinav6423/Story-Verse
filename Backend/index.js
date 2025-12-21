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
app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}))
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