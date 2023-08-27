import Product from "../models/productModel.js";
import asyncHandler from "express-async-handler"
import slugify from "slugify";

//create product
export const createProuduct = asyncHandler(async (req, res) => {
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const newProduct = await Product.create(req.body)
        res.json(newProduct)
    } catch (error) {
        throw new Error(error)
    }
})
//update product
export const updateProuduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        if (req.body.title) {
            req.body.slug = slugify(req.body.title)
        }
        const updateProduct = await Product.findOneAndUpdate({ _id: id }, req.body, {
            new: true
        })
        res.json(updateProduct)
    } catch (error) {
        throw new Error(error)
    }
})
//delete product
export const deleteProuduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deleteProduct = await Product.findByIdAndDelete(id)
        res.json(deleteProduct)
    } catch (error) {
        throw new Error(error)
    }
})
//get product
export const getProduct = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const findProduct = await Product.findById(id)
        res.json(findProduct)
    } catch (error) {
        throw new Error(error)
    }
})
//get all products
export const getAllProducts = asyncHandler(async (req, res) => {
    try {
        //Filtering
        const queryObj = { ...req.query }
        const excludeFields = ['page', 'sort', 'limit', 'fields']
        excludeFields.forEach(el => delete queryObj[el])
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)
        let query = Product.find(JSON.parse(queryStr))

        //Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(" ")
            query = query.sort(sortBy)
        } else {
            query = query.sort('-createdAt')
        }
        //Limiting Fields  
        if (req.query.fields) {
            const fields = req.query.fields.split(',').join(" ")
            query = query.select(fields)
        } else {
            query = query.select('-__v')
        }
        //Pagination
        const page = req.query.page
        const limit = req.query.limit
        const skip = (page - 1) * limit
        query = query.skip(skip).limit(limit)
        if (req.query.page) {
            const productCount = await Product.countDocuments()
            if (skip >= productCount) throw new Error("This page does not exist")
        }
        const getAllProducts = await query
        res.json(getAllProducts)
    } catch (error) {
        throw new Error(error)
    }
})