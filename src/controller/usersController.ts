import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import userModel from "../models/user/userModel";
import AppError from "../util/appError";
import aadharModel from "../models/user/aadharModel";
import { AuthenticatedRequest } from "../types";

// get new users
export const getNewUsers = catchAsync(async (req: Request, res: Response) => {
    const today = (new Date()).setHours(0, 0, 0, 0)
    const page = req.params.page as string;
    let usersPerPage = 100;
    const totalUsers = await userModel.countDocuments({ createdAt: { $gte: today } });
    let totalPages = Math.ceil(totalUsers / usersPerPage);
    let skip = (parseInt(page) - 1) * usersPerPage;

    const users = await userModel.find({ createdAt: { $gte: today } }, { displayName: 1, gender: 1, native: 1, 'personalInfo.religion': 1, createdAt: 1 }).skip(skip).limit(usersPerPage)

    res.status(200).json({ count: totalUsers, pages: totalPages, users })
})

// get all users
export const getUsers = catchAsync(async (req: Request, res: Response) => {
    const page = req.params.page as string;
    let usersPerPage = 100;
    const totalUsers = await userModel.countDocuments();
    let totalPages = Math.ceil(totalUsers / usersPerPage);
    let skip = (parseInt(page) - 1) * usersPerPage;

    const users = await userModel.find({}, { displayName: 1, gender: 1, native: 1, 'personalInfo.religion': 1, createdAt: 1 }).skip(skip).limit(usersPerPage)

    res.status(200).json({ totalUsers, totalPages, users })
})

// get a user with userId
export const getUser = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.id
    const user = await userModel.findById(userId)
    if (!user) throw new AppError({ statusCode: 404, message: 'User with this id not found' })
    res.status(200).json({ user })
})

// Users - ID not verified
export const idVerificationUsers = catchAsync(async (req: Request, res: Response) => {
    const users = await aadharModel.find({ 'verification.verified': false })
        .populate({
            path: 'userId',
            model: 'User',
            select: { displayName: 1, gender: 1, 'personalInfo.religion': 1, 'personalInfo.caste': 1, native: 1, }
        })

    res.status(200).json({ count: users.length, users })
})

// Get aadhar details of a user
export const aadharDetails = catchAsync(async (req: Request, res: Response) => {
    const userId = req.params.userId
    const aadharDetails = await aadharModel.findOne({ userId }).populate({
        path: 'userId',
        model: 'User',
        select: { firstName: 1, lastName: 1, dob: 1, profileImage: 1, native: 1, family: 1, familyAddress: 1, createdAt: 1 }
    })

    res.status(200).json({ aadharDetails })
})

// Approve ID
export const verifyId = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.query.userId;
    await aadharModel.findOneAndUpdate({ userId }, { $set: { 'verification.verified': true, 'verification.verifiedBy': req.decodedToken.adminId, 'verification.verificationDate': Date.now() } })
})

// Reject ID
export const rejectId = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const userId = req.query.userId;
    await aadharModel.findOneAndUpdate({ userId }, { $set: { 'verification.verified': false, 'verification.verifiedBy': req.decodedToken.adminId, 'verification.verificationDate': Date.now() } })
})
