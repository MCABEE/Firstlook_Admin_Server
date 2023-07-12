import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import userModel from "../models/user/userModel";

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
    res.status(200).json({ user })
})