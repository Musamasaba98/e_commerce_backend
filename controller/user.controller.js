import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import { generateToken } from "../config/jwtToken.js";


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
        const { password, ...others } = findUser._doc;
        res.json({ ...others, token: generateToken(findUser._id) })
    } else {
        throw new Error("Invalid Credentials")
    }
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
    try {
        const user = await User.findByIdAndDelete(id);
        res.json(user)
    } catch (error) {
        throw new Error(error)
    }
})