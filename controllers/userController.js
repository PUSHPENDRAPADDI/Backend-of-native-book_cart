import userModel from "../models/userModel.js";
import { getDataUri } from '../utils/features.js'
import cloudinary from 'cloudinary'


// Register
export const registerController = async (req, res) => {
    try {
        const { name, email, password, address, city, country, phone, answer } = req.body;
        if (!name || 
            !email || 
            !password || 
            !city || 
            !address || 
            !country || 
            !phone || 
            !answer) {
            return res.status(500).send({
                success: false,
                message: "Please provide all fields"
            })
        }
        // Check existing user

        const existingUser = await userModel.findOne({ email })
        // validation
        if (existingUser) {
            return res.status(500).send({
                success: false,
                message: "Email already present"
            })
        }
        const user = await userModel.create({
            name, email, password, address, city, country, phone, answer
        })
        res.status(200).send({
            success: true,
            message: 'Registration Success, please login',
            user,
        })
    } catch (error) {
        console.log(error)
        res.status(500).send({
            success: false,
            message: 'Error in register API',
            error
        })
    }
}


// Login

export const loginController = async (req, res) => {
    try {
        const { email, password } = req.body
        if (!email || !password) {
            return res.status(500).send({
                success: false,
                message: 'Please ad email and password'
            })
        }
        const user = await userModel.findOne({ email })
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "User not found"
            })
        }
        // Check pass
        const isMatch = await user.comparePassword(password)
        // validation
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: 'Invalid credentials'
            })
        }
        // token 
        const token = user.generateToken();
        res
            .status(200)
            .cookie('token', token, {
                expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
                secure: process.env.Node_ENV === 'Development' ? true : false,
                httpOnly: process.env.Node_ENV === 'Development' ? true : false,
                sameSite: process.env.Node_ENV === 'Development' ? true : false
            }).send({
                success: true,
                message: "Login Successfully",
                token,
                user,
            })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in login api',
            error
        })
    }
}

// Profile

export const getUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        user.password = undefined
        res.status(200).send({
            success: true,
            message: "User profile fetched Successfully",
            user
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in profile API',
            error
        })
    }
}

// logout

export const logoutController = async (req, res) => {
    try {
        res.status(200).cookie('token', "", {
            expires: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            secure: process.env.Node_ENV === 'Development' ? true : false,
            httpOnly: process.env.Node_ENV === 'Development' ? true : false,
            sameSite: process.env.Node_ENV === 'Development' ? true : false
        }).send({
            success: true,
            message: "Logout Successfully"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in Logout API',
            error
        })
    }
}

// Update user profile 

export const updateUserProfileController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id)
        const { name, email, address, city, country, phone } = req.body
        // Update and validate
        if (name) user.name = name
        if (address) user.name = address
        if (email) user.email = email
        if (city) user.city = city
        if (country) user.country = country
        if (phone) user.phone = phone
        // save User
        await user.save();
        res.status(200).send({
            success: true,
            message: "User profile Updated"
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: 'Error in update profile API',
            error
        })
    }
}

// Update User password
export const updatePasswordController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id);
        const { oldPassword, newPassword } = req.body;
        //valdiation
        if (!oldPassword || !newPassword) {
            return res.status(500).send({
                success: false,
                message: "Please provide old or new password",
            });
        }
        // old pass check
        const isMatch = await user.comparePassword(oldPassword);
        //validaytion
        if (!isMatch) {
            return res.status(500).send({
                success: false,
                message: "Invalid Old Password",
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Password Updated Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In update password API",
            error,
        });
    }
};

// update profile picture 
export const updateProfilePictureController = async (req, res) => {
    try {
        console.log(req.user);
        const user = await userModel.findById(req.user._id)
        const file = getDataUri(req.file)
        await cloudinary.v2.uploader.destroy(user.profilePic.public_id)
        // Update
        const cdb = await cloudinary.v2.uploader.upload(file.content)
        user.profilePic = {
            public_id: cdb.public_id,
            url: cdb.secure_url
        }
        // save
        await user.save()
        res.status(200).send({
            success: true,
            message: 'Profile picture uploaded'
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In update profile API",
            error,
        });
    }
}

// FORGOT PASSWORD
export const passwordResetController = async (req, res) => {
    try {
        // user get email || newPassword || answer
        const { email, newPassword, answer } = req.body;
        // valdiation
        if (!email || !newPassword || !answer) {
            return res.status(500).send({
                success: false,
                message: "Please Provide All Fields",
            });
        }
        // find user
        const user = await userModel.findOne({ email, answer });
        //valdiation
        if (!user) {
            return res.status(404).send({
                success: false,
                message: "invalid user or answer",
            });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).send({
            success: true,
            message: "Your Password Has Been Reset Please Login !",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({
            success: false,
            message: "Error In password reset API",
            error,
        });
    }
};