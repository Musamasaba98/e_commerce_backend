import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";



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