import express from 'express';
import { getUserProfileController, loginController, logoutController, passwordResetController, registerController, updatePasswordController, updateProfilePictureController, updateUserProfileController } from '../controllers/userController.js';
import { isAuth } from '../middlewares/authMiddleware.js';
import { singleUpload } from '../middlewares/multer.js';
import { rateLimit } from 'express-rate-limit';

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 100,
    standardHeaders: 'draft-7',
    legacyHeaders: false
})

// Routes object
const userRouter = express.Router();

// routes register
userRouter.post('/register', limiter, registerController)

// login
userRouter.post('/login', limiter, loginController)

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

// FORGOT PASSWORD
userRouter.post("/reset-password", isAuth, passwordResetController);
export default userRouter