import { createOrderController } from "../controllers/orderController.js";
import { isAuth } from "../middlewares/authMiddleware.js";
import express from 'express'

const orderRouter = express.Router();

// Create category
orderRouter.post("/create", isAuth, createOrderController);


export default orderRouter