import express from 'express'
import { createCategoryController } from '../controllers/categoryController'
import { isAuth } from '../middlewares/authMiddleware.js'

const categoryRouter = express.Router()

// routers

// create category
categoryRouter.post("/create", isAuth, createCategoryController)

export default categoryRouter