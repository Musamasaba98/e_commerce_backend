import BCategory from "../models/blogCategoryModel.js";
import asyncHandler from "express-async-handler";




export const createCategory = asyncHandler(async (req, res) => {
    try {
        const newCategory = await BCategory.create(req.body)
        res.json(newCategory)
    } catch (error) {
        throw new Error(error)
    }
})

export const updateCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const updatedCategory = await BCategory.findByIdAndUpdate(id, req.body, {
            new: true
        })
        res.json(updatedCategory)
    } catch (error) {
        throw new Error(error)
    }
})
export const deleteCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const deletedCategory = await BCategory.findByIdAndDelete(id)
        res.json(deletedCategory)
    } catch (error) {
        throw new Error(error)
    }
})
export const getCategory = asyncHandler(async (req, res) => {
    try {
        const { id } = req.params
        const getaCategory = await BCategory.findById(id)
        res.json(getaCategory)
    } catch (error) {
        throw new Error(error)
    }
})
export const getAllCategory = asyncHandler(async (req, res) => {
    try {
        const allCategory = await BCategory.find()
        res.json(allCategory)
    } catch (error) {
        throw new Error(error)
    }
})