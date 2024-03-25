import orderModel from '../models/orderModel.js'
import productModel from '../models/productModel.js'

// create controller
export const createOrderController = async (req,res) => {
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