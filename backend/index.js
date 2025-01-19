import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";
import authRoute from "./Routes/auth.js";
import doctorRoute from "./Routes/doctor.js";
import scheduleRoute from "./Routes/schedule.js";
import userRoute from "./Routes/user.js";
import careTakerRoute from "./Routes/care.js"


dotenv.config();

const app = express();
const port = process.env.PORT || 8000;


const corsOptions = {
    origin: true
};

app.get("/", (req, res) => {
    res.send("Api is working");
});

mongoose.set('strictQuery', false);
const connectDB = async () => {
    try {
        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        console.log("MongoDB is connected");
        
    } catch (error) {
        console.log("MongoDB not connected");
    }
}

//middleware
app.use(express.json());
app.use(cors(corsOptions));
app.use(cookieParser());
app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/doctors', doctorRoute);
app.use('/api/v1/schedule', scheduleRoute);
app.use('/api',careTakerRoute);



app.listen(port, () => {
    connectDB();
    console.log("Server is running on " + port);
});