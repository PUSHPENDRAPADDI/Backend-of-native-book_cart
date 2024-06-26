import JWT from 'jsonwebtoken'
import userModel from '../models/userModel.js'

// User auth

export const isAuth = async (req, res, next) => {
    const { token } = req.cookies
    if (!token) {
        return res.status(401).send({
            success: false,
            message: 'UnAuthorised User'
        })
    }
    const decodeData = JWT.verify(token
        , process.env.JWT_SECRET)
    req.user = await userModel.findById(decodeData._id)
    next()
}

// Admin auth

export const isAdmin = async (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(401).send({
            success: false,
            message: 'Admin only allowed'
        })
    }
    next()
}