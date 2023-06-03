import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../config/jwtToken.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import { generateRefreshToken } from "../config/refreshToken.js";
import jwt from "jsonwebtoken";

//Create a user
export const createUser = asyncHandler(async (req, res) => {
    const email = req.body.email
    const findUser = await User.findOne({ email })

    if (!findUser) {
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
    const findUser = await User.findOne({ email })
    if (findUser && await findUser.isPasswordMatched(password)) {
        const refreshToken = generateRefreshToken(findUser._id)
        await User.findByIdAndUpdate(findUser._id, {
            refreshToken: refreshToken
        }, {
            new: true
        })
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 72 * 60 * 60 * 1000
        })
        const { password, ...others } = findUser._doc;
        res.json({ ...others, token: generateToken(findUser._id) })
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