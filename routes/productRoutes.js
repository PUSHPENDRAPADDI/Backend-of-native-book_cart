import express from 'express'
import {
    createProductController,
    deleteProductController,
    deleteProductImageController,
    getAllProductController,
    getSingleProductController,
    updateProductController,
    updateProductImageController
} from '../controllers/productController.js';
import { isAuth } from '../middlewares/authMiddleware.js'
import { singleUpload } from '../middlewares/multer.js'

const productRouter = express.Router();

// router
productRouter.get('/get-all', getAllProductController)

// Get single product 
productRouter.get('/:id', getSingleProductController)

// Create product
productRouter.post('/createProduct', isAuth, singleUpload, createProductController)

// Update product
productRouter.put('/:id', isAuth, updateProductController)

// Update product image
productRouter.put('/image/:id', isAuth, singleUpload, updateProductImageController)

// delete product image
productRouter.delete('/delete-image/:id', isAuth, deleteProductImageController)

// delete product 
productRouter.delete('/delete/:id', isAuth, deleteProductController)

export default productRouter;