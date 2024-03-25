import { changeOrderStatusController, createOrderController, getAllOrdersController, getMyOrdersController, getSingleOrderController, paymentsController } from "../controllers/orderController.js";
import { isAdmin, isAuth } from "../middlewares/authMiddleware.js";
import express from 'express'

const orderRouter = express.Router();

// Create category
orderRouter.post("/create", isAuth, createOrderController);

// Get category
orderRouter.get("/my-orders", isAuth, getMyOrdersController);

// Get single category
orderRouter.get("/order/:id", isAuth, getSingleOrderController);

// accept payment
orderRouter.post('/payment', isAuth, paymentsController)


// Admin Part

// get all orders
orderRouter.get('/admin/get-all-orders', isAuth, isAdmin, getAllOrdersController)

// change order status
orderRouter.put('/admin/order/:id', isAuth, isAdmin, changeOrderStatusController)

export default orderRouter