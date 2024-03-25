import express from 'express'
import { createCategoryController, deleteCategoriesController, getAllCategoriesController, updateCategoriesController } from '../controllers/categoryController.js'
import { isAuth } from '../middlewares/authMiddleware.js'

const categoryRouter = express.Router()

// routers

// create category
categoryRouter.post("/create", isAuth, createCategoryController)

// get all category
categoryRouter.get("/get-all", getAllCategoriesController)

// delete category
categoryRouter.delete("/delete/:id", deleteCategoriesController)

// update category
categoryRouter.put("/update/:id", updateCategoriesController)

export default categoryRouter