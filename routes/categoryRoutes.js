import express from 'express'
import { createCategoryController, deleteCategoriesController, getAllCategoriesController, updateCategoriesController } from '../controllers/categoryController.js'
import { isAdmin, isAuth } from '../middlewares/authMiddleware.js'

const categoryRouter = express.Router()

// routers

// create category
categoryRouter.post("/create", isAuth, isAdmin, createCategoryController)

// get all category
categoryRouter.get("/get-all", getAllCategoriesController)

// delete category
categoryRouter.delete("/delete/:id", isAuth, isAdmin, deleteCategoriesController)

// update category
categoryRouter.put("/update/:id", isAuth, isAdmin, updateCategoriesController)

export default categoryRouter