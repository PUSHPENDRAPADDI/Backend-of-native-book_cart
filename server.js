import express from "express";
import colors from 'colors';
import morgan from 'morgan';
import cors from 'cors';
import dotenv from 'dotenv';
import cloudinary from 'cloudinary';
// route import
import testRoutes from './routes/testRoutes.js'
import connectDB from "./config/db.js";
import userRouter from "./routes/userRoutes.js";
import productRouter from './routes/productRoutes.js'
import cookieParser from "cookie-parser";
// dot env config
dotenv.config();

// data base connection
connectDB()

cloudinary.v2.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_SECRET
})

// rest object

const app = express();

// middleware

app.use(morgan('dev'));
app.use(express.json());
app.use(cors());
app.use(cookieParser())

// routes
app.use('/api/v1', testRoutes)
app.use('/api/v1/user', userRouter)
app.use('/api/v1/product', productRouter)

// port
const PORT = process.env.PORT;

// listen 

app.listen(PORT, () => {
    console.log(`Server Running on ${PORT} on ${process.env.NODE_ENV} Mode`.bgMagenta.white);
})

// 25 video completed