import categoryModel from "../models/categoryModel.js";
import productModel from "../models/productModel.js"
// Create category 

export const createCategoryController = async (req, res) => {
    try {
        const { category } = req.body
        // validation
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Please provide category name'
            })
        }
        await categoryModel.create({ category })
        res.status(201).send({
            success: true,
            message: `${category} category created successfully`
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in create Category API'
        })
    }
}

// Get All category

export const getAllCategoriesController = async (req, res) => {
    try {
        const category = await categoryModel.find({})
        res.status(200).send({
            success: true,
            message: 'Categories fetch successfully',
            categoryCount: category.length,
            category
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in get all Category API'
        })
    }
}

// delete category

export const deleteCategoriesController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            })
        }
        // find product with this category id
        const products = await productModel.find({ category: category._id })
        //Update product category
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            product.category = undefined
            await product.save()
        }
        await category.deleteOne()
        res.status(200).send({
            success: true,
            message: 'Category deleted successfully'
        })
    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in create Category API'
        })
    }
}

// update category

export const updateCategoriesController = async (req, res) => {
    try {
        const category = await categoryModel.findById(req.params.id)
        if (!category) {
            return res.status(404).send({
                success: false,
                message: 'Category not found'
            })
        }

        const { updatedCategory } = req.body
        // find product with this category id
        const products = await productModel.find({ category: category._id })
        //Update product category
        for (let i = 0; i < products.length; i++) {
            const product = products[i]
            product.category = updatedCategory
            await product.save()
        }
        if(updatedCategory) category.category = updatedCategory
        await category.save({ category: updatedCategory })
        res.status(200).send({
            success: true,
            message: 'Category updated successfully'
        })
    } catch (error) {
        console.log(error);
        if (error.name === 'CastError') {
            return res.status(500).send({
                success: false,
                message: 'Invalid Id'
            })
        }
        res.status(500).send({
            success: false,
            message: 'Error in create Category API'
        })
    }

}