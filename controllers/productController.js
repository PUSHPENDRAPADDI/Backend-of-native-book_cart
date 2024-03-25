import productModel from "../models/productModel.js";
import { getDataUri } from '../utils/features.js';
import cloudinary from 'cloudinary'

// Get all
export const getAllProductController = async (req, res) => {
    try {
        const products = await productModel.find({})
        res.status(200).send({
            success: true,
            message: 'All products fetched successfully',
            products
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in get Product API',
            error
        })
    }
}

// Get single product
export const getSingleProductController = async (req, res) => {
    try {
        // get product id
        const product = await productModel.findById(req.params.id)
        // Validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        return res.status(200).send({
            success: true,
            message: 'Product fetch successfully',
            product
        })
    } catch (error) {
        console.log(error);
        // Case error Object error handling
        if (error.name === 'CaseError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in get single product API',
            error
        })
    }
}

// Create product 
export const createProductController = async (req, res) => {
    console.log(req.body);
    try {
        const { name, description, price, category, stock } = req.body
        // Validation
        // if (!name || !description || !price || !category || !stock) {
        //     return res.status(500).send
        //         ({
        //             success: false,
        //             message: 'Provide all required fields'
        //         })
        // }
        if (!req.file) {
            return res.status(500).send({
                success: false,
                message: 'Please provide product images'
            })
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        await productModel.create({
            name, description, price, category, stock, images: [image]
        })
        res.status(201).send({
            success: true,
            message: 'Product created successfully'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in creating product API',
            error
        })
    }
}

// Update product
export const updateProductController = async (req, res) => {
    try {
        // Find product
        const product = await productModel.findById(req.params.id)
        // Validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        const { name, description, stock, price, category } = req.body
        // validate and update
        if (name) product.name = name
        if (description) product.description = description
        if (price) product.price = price
        if (stock) product.stock = stock
        if (category) product.category = category
        await product.save();
        res.status(200).send({
            success: true,
            message: 'Product details updated'
        })
    } catch (error) {
        console.log(error);
        // cast error
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in update product API',
            error
        })
    }
}

// Update product image

export const updateProductImageController = async (req, res) => {
    try {
        // Find product
        console.log(req.params.id);
        const product = await productModel.findById(req.params.id)
        // Validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        if (!req.file) {
            return res.status(404).send({
                success: false,
                message: "Product image not found"
            })
        }
        const file = getDataUri(req.file)
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        const image = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        // save
        product.images.push(image)
        await product.save()
        res.status(200).send({
            success: true,
            message: 'Product image updated'
        })
    } catch (error) {
        console.log(error);
        // cast error
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in creating product API',
            error
        })
    }
}

// Delete product image 

export const deleteProductImageController = async (req, res) => {
    try {
        const product = await productModel.findById(req.params.id)
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        // image id find
        const id = req.query.id
        if (!id) {
            return res.status(404).send({
                success: false,
                message: 'Product image not found'
            })
        }
        let isExist = -1
        product.images.forEach((item, index) => {
            if (item._id.toString() === id.toString()) isExist = index
        })
        if (isExist < 0) {
            return res.status(404).send({
                success: false,
                message: 'Image not found'
            })
        }
        // delete image
        await cloudinary.v2.uploader.destroy(product.images[isExist].public_id)
        product.images.splice(isExist, 1)
        await product.save()
        return res.status(200).send({
            success: true,
            message: "Product image deleted successfully"
        })
    } catch (error) {
        console.log(error);
        // cast error
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in delete product API',
            error
        })
    }
}

// Delete Product 

export const deleteProductController = async (req, res) => {
    try {
        // find product
        const product = await productModel.findById(req.params.id)
        // validation
        if (!product) {
            return res.status(404).send({
                success: false,
                message: 'Product not found'
            })
        }
        // Find and delete image cloudinary
        for (let i = 0; i < product.images.length; i++) {
            await cloudinary.v2.uploader.destroy(product.images[i].public_id)
        }
        await product.deleteOne()
        res.status(200).send({
            success: true,
            message: 'Product deleted successfully'
        })
    } catch (error) {
        console.log(error);
        // cast error
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in delete product API',
            error
        })
    }
}