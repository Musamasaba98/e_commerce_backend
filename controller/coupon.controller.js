import Coupon from "../models/couponModel.js";
import { validateMongoDbId } from "../utils/validateMongodbId.js";
import asyncHandler from 'express-async-handler'

export const createCoupon = asyncHandler(async (req, res) => {
    try {
        const newCoupon = await Coupon.create(req.body)
        res.json(newCoupon)
    } catch (error) {
        throw new Error(error)
    }
})
export const getAllCoupons = asyncHandler(async (req, res) => {
    try {
        const coupons = await Coupon.find()
        res.json(coupons)
    } catch (error) {
        throw new Error(error)
    }
})
export const getCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const coupon = await Coupon.findById(id)
        res.json(coupon)
    } catch (error) {
        throw new Error(error)
    }
})
export const editCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const editedCoupon = await Coupon.findByIdAndUpdate(id, req.body, { new: true })
        res.json(editedCoupon)
    } catch (error) {
        throw new Error(error)
    }
})
export const deletedCoupon = asyncHandler(async (req, res) => {
    const { id } = req.params
    try {
        const deletedCoupon = await Coupon.findByIdAndDelete(id)
        res.json(deletedCoupon)
    } catch (error) {
        throw new Error(error)
    }
})