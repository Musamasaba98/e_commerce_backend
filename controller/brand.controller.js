import Brand from "../models/brandModel.js";
import asyncHandler from "express-async-handler";




export const createBrand = asyncHandler(async (req, res) => {
    try {
        const newBrand = await Brand.create(req.body)
        res.json(newBrand)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateBrand = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const updatedBrand = await Brand.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedBrand)
    } catch (error) {
        throw new Error(error)
    }
})
export const deleteBrand = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const deletedBrand = await Brand.findByIdAndDelete(id)
        res.json(deletedBrand)
    } catch (error) {
        throw new Error(error)
    }
})
export const getBrand = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const getaBrand = await Brand.findById(id)
        res.json(getaBrand)
    } catch (error) {
        throw new Error(error)
    }
})
export const getAllBrand = asyncHandler(async (req, res) => {
    try {
        const allBrand = await Brand.find()
        res.json(allBrand)
    } catch (error) {
        throw new Error(error)
    }
})