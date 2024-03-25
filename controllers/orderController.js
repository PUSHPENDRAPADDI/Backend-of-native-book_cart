import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js'
import { stripe } from '../server.js';

// create controller
export const createOrderController = async (req, res) => {
    try {
        const {
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        } = req.body;
        //valdiation
        // if (!shippingInfo ||
        //     !orderItems ||
        //     !paymentMethod ||
        //     !paymentInfo ||
        //     !itemPrice ||
        //     !tax ||
        //     !shippingCharges ||
        //     !totalAmount
        // ) {
        //     return res.status(404).send({
        //         success: false,
        //         message: "Please provide all mendetory fields"
        //     })
        // }
        await orderModel.create({
            user: req.user._id,
            shippingInfo,
            orderItems,
            paymentMethod,
            paymentInfo,
            itemPrice,
            tax,
            shippingCharges,
            totalAmount,
        });

        // stock update
        for (let i = 0; i < orderItems.length; i++) {
            // find product
            const product = await productModel.findById(orderItems[i].product);
            product.stock -= orderItems[i].quantity;
            await product.save();
        }
        res.status(201).send({
            success: true,
            message: "Order Placed Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in create order API'
        })
    }
}

// Get all orders 

export const getMyOrdersController = async (req, res) => {
    try {
        // find orders
        const orders = await orderModel.find({ user: req.user._id });
        //valdiation
        if (!orders) {
            return res.status(404).send({
                success: false,
                message: "No orders found",
            });
        }
        res.status(200).send({
            success: true,
            message: "Your Orders data",
            totalOrder: orders.length,
            orders,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In My orders Order API",
            error,
        });
    }
};


// Get single order 

export const getSingleOrderController = async (req, res) => {
    try {
        // find orders
        const order = await orderModel.findById(req.params.id);
        //valdiation
        if (!order) {
            return res.status(404).send({
                success: false,
                message: "no order found",
            });
        }
        res.status(200).send({
            success: true,
            message: "your order fetched",
            order,
        });
    } catch (error) {
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error In Get UPDATE Products API",
            error,
        });
    }
}

// Accept payments

export const paymentsController = async (req, res) => {
    try {
        // get ampunt
        const { totalAmount } = req.body;
        // validation
        if (!totalAmount) {
            return res.status(404).send({
                success: false,
                message: "Total Amount is require",
            });
        }
        const { client_secret } = await stripe.paymentIntents.create({
            amount: Number(totalAmount * 100),
            currency: "usd",
        });
        res.status(200).send({
            success: true,
            client_secret,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In payment Products API",
            error,
        });
    }
}


// Admin section

// Get all orders

export const getAllOrdersController = async (req, res) => {
    try {
        const orders = await orderModel.find({})
        res.status(200).send({
            success: true,
            message: 'All Orders data',
            totalOrder: orders.length,
            orders
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In Get all order API",
            error,
        });
    }

}

// Change Order status
export const changeOrderStatusController = async (req, res) => {
    try {
        // find order
        const order = await orderModel.findById(req.params.id);
        // validatiom
        if (!order) {
            return res.status(404).send({
                success: false,
                message: "Order not found",
            });
        }
        if (order.orderStatus === "processing") order.orderStatus = "shipped";
        else if (order.orderStatus === "shipped") {
            order.orderStatus = "deliverd";
            order.deliverdAt = Date.now();
        } else {
            return res.status(500).send({
                success: false,
                message: "Order already deliverd",
            });
        }
        await order.save();
        res.status(200).send({
            success: true,
            message: "order status updated",
        });
    } catch (error) {
        console.log(error);
        // cast error ||  OBJECT ID
        if (error.name === "CastError") {
            return res.status(500).send({
                success: false,
                message: "Invalid Id",
            });
        }
        res.status(500).send({
            success: false,
            message: "Error In change order status API",
            error,
        });
    }
}