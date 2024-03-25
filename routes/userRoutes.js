import express from 'express';
import { getUserProfileController, loginController, logoutController, registerController, updatePasswordController, updateProfilePictureController, updateUserProfileController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js'

// Routes object
const userRouter = express.Router();

// routes
userRouter.post('/register', registerController)

// login
userRouter.post('/login', loginController)

// profile
userRouter.get('/profile', isAuth, getUserProfileController)

// logout
userRouter.get('/logout', isAuth, logoutController)

// update profile
userRouter.put('/profile-update', isAuth, updateUserProfileController)

// update password 
userRouter.put('/password-update', isAuth, updatePasswordController)

// update profile pic
userRouter.put('/update-profile', singleUpload, isAuth, updateProfilePictureController)

export default userRouter