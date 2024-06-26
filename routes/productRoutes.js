import express from 'express'
import {
    createProductController,
    deleteProductController,
    deleteProductImageController,
    getAllProductController,
    getSingleProductController,
    getTopProductController,
    productReviewController,
    updateProductController,
    updateProductImageController
} from '../controllers/productController.js';
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js'
import { singleUpload } from '../middlewares/multer.js'

const productRouter = express.Router();

// router
productRouter.get('/get-all', getAllProductController)

// Get top product
productRouter.get('/getTopProduct', getTopProductController)

// Get single product 
productRouter.get('/:id', getSingleProductController)

// Create product
productRouter.post('/createProduct', isAuth, isAdmin, singleUpload, createProductController)

// Update product
productRouter.put('/:id', isAuth, isAdmin, updateProductController)

// Update product image
productRouter.put('/image/:id', isAuth, isAdmin, singleUpload, updateProductImageController)

// delete product image
productRouter.delete('/delete-image/:id', isAuth, isAdmin, deleteProductImageController)

// delete product 
productRouter.delete('/delete/:id', isAuth, isAdmin, deleteProductController)

// REVIEW PRODUCT
productRouter.put("/:id/review", isAuth, productReviewController);
export default productRouter;