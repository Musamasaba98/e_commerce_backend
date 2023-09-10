import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../config/jwtToken.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import jwt from "jsonwebtoken";
import { sendEmail } from "./email.controller.js";
import crypto from 'crypto'

//Create a user
export const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email
    const findAdmin = await User.findOne({ email })

    if (!findAdmin) {
        //Create new User
        const newUser = await User.create(req.body)
        res.json(newUser)
    } else {
        //User already registered
        throw new Error("User Already Exists")
    }
})

//Login a user
export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    //check if user exists
    const findAdmin = await User.findOne({ email })
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findAdmin._id)
        await User.findByIdAndUpdate(findAdmin._id, {
            refreshToken: refreshToken
        }, {
            new: true
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        const { password, ...others } = findAdmin._doc;
        res.json({ ...others, token: generateToken(findAdmin._id) })
    } else {
        throw new Error("Invalid Credentials")
    }
})
//Login admin
export const loginAdmin = asyncHandler(async (req, res) => {
    const { email, password } = req.body
    //check if user exists
    const findAdmin = await User.findOne({ email })
    if (findAdmin && await findAdmin.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findAdmin._id)
        await User.findByIdAndUpdate(findAdmin._id, {
            refreshToken: refreshToken
        }, {
            new: true
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        const { password, ...others } = findAdmin._doc;
        res.json({ ...others, token: generateToken(findAdmin._id) })
    } else {
        throw new Error("Invalid Credentials")
    }
})
//handle refresh token
export const handleRefreshToken = asyncHandler(async (req, res) => {
    const cookie = req.cookies;
    if (!cookie?.refreshToken) throw new Error("No refresh token in Cookies")
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user) throw new Error("No Refresh Token present in db or not matched")
    jwt.verify(refreshToken, process.env.JWT_SECRET, (err, decoded) => {
        if (err || user.id !== decoded.id) {
            throw new Error("There is something wrong with refresh token")
        }
        const token = generateToken(user._id)
        res.json({ token })
    })
})
//logout functionality
export const logout = asyncHandler(async (req, res) => {
    const cookie = req.cookies
    if (!cookie?.refreshToken) throw new Error("No Refresh Token in Cookies")
    const refreshToken = cookie.refreshToken
    const user = await User.findOne({ refreshToken })
    if (!user) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: true
        })
        return res.status(204)//forbidden
    }
    await User.findOneAndUpdate({ refreshToken }, {
        refreshToken: ""
    })
    res.clearCookie("refreshToken", {
        httpOnly: true,
        secure: true
    })
    res.sendStatus(204)//forbidden
})
//Update user
export const updateUser = asyncHandler(async (req, res) => {
    const { id } = req.user;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {
            firstname: req?.body?.firstname,
            lastname: req?.body?.lastname,
            email: req?.body?.email,
            mobile: req?.body?.mobile,
            role: req?.body?.role
        }, {
            new: true
        })
        res.json(updatedUser)
    } catch (error) {
        throw new Error("Invalid Credentials")
    }
})
//save user Address
export const saveAddress = asyncHandler(async (req, res) => {
    const { _id } = req.user;
    validateMongoDbId(_id)
    try {
        const updatedUser = await User.findByIdAndUpdate(_id, {
            address: req?.body?.address,

        }, {
            new: true
        })
        res.json(updatedUser)

    } catch (error) {
        throw new Error(error)
    }
})
//Get all users

export const getAllUsers = asyncHandler(async (req, res) => {
    try {
        const users = await User.find();
        res.json(users)
    } catch (error) {
        throw new Error(error)
    }
})
//Get single User

export const getUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const user = await User.findById(id);
        if (user === null) {
            res.send("User Not Found")
        } else {
            res.json(user)
        }
    } catch (error) {
        throw new Error(error)
    }
})
//Delete User

export const deleteUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const user = await User.findByIdAndDelete(id);
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})

export const blockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const block = await User.findByIdAndUpdate(id, {
            isBlocked: true
        },
            {
                new: true
            })
        res.json({
            message: "User Blocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})
export const unBlockUser = asyncHandler(async (req, res) => {
    const { id } = req.params
    validateMongoDbId(id)
    try {
        const unblock = await User.findByIdAndUpdate(id, {
            isBlocked: false
        },
            {
                new: true
            })
        res.json({
            message: "User Unblocked"
        })
    } catch (error) {
        throw new Error(error)
    }
})
export const updatePassword = asyncHandler(async (req, res) => {
    const { _id } = req.user
    const { password } = req.body
    console.log(password)
    validateMongoDbId(_id)
    const user = await User.findById(_id)
    if (password) {
        user.password = password
        const updatedPassword = await user.save()
        res.json(updatedPassword)
    } else {
        req.json(user)
    }
})

export const forgotPasswordToken = asyncHandler(async (req, res) => {
    const { email } = req.body
    const user = await User.findOne({ email })
    if (!user) throw new Error("No user with this Email")
    try {
        const token = await user.createPasswordResetToken()
        await user.save()
        const resetURL = `Hi, please follow this link to reset your Password. This link is valid till 10 minutes from now <a href='http://localhost:4000/api/user/reset-password/${token}'>Click Here</a>`
        const data = {
            text: `Hey ${user.firstname}`,
            to: email,
            subject: "Forgot Password Link",
            html: resetURL
        }
        sendEmail(data)
        res.json(token)
    } catch (error) {
        throw new Error(error)
    }
})
export const resetPassword = asyncHandler(async (req, res) => {
    const { password } = req.body
    const { token } = req.params
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex")
    const user = await User.findOne({ passwordResetToken: hashedToken, passwordResetExpires: { $gt: Date.now() } })
    if (!user) throw new Error("Token Expired please try again.")
    user.password = password
    user.passwordResetExpires = null
    user.passwordResetToken = null
    await user.save()
    res.json(user)
})
export const getUserWishlist = asyncHandler(async (req, res) => {
    const { _id } = req.user
    try {
        const findUserWishlist = await User.findById(_id).populate("wishList")
        res.json(findUserWishlist)
    } catch (error) {
        throw new Error(error)
    }
})