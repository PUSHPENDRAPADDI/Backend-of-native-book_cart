import mongoose from 'mongoose';

// Review model

const reviewSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "name is required"],
        },
        rating: {
            type: Number,
            default: 0,
        },
        comment: {
            type: String,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
            required: [true, "user required"],
        },
    },
    { timestamps: true }
);

//   Product schema
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product name is required']
    },
    description: {
        type: String,
        required: [true, 'Product description is required']
    },
    price: {
        type: Number,
        required: [true, "Product price is required"]
    },
    stock: {
        type: Number,
        required: [true, "Product stock required"]
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Categories'
    },
    images: [
        {
            public_id: String,
            url: String
        }
    ],
    reviews: [reviewSchema],
    rating: {
        type: Number,
        default: 0,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, { timestamps: true })

export const productModel = mongoose.model('Products', productSchema);
export default productModel;