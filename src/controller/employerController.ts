import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import employerModel from "../models/employer/employerModel";

// Add employer
export const addEmployer = catchAsync(async (req: Request, res: Response) => {
    const { country, stream, employer } = req.body;
    await employerModel.create({
        country,
        stream,
        name: employer,
    })
    res.sendStatus(201)
})

// Get employers
export const getEmployers = catchAsync(async (req: Request, res: Response) => {
    const country = req.query?.country || 'India';
    const employers = await employerModel.find({ country })
    res.status(200).json({ employers })
})

export const deleteEmployer = catchAsync(async (req: Request, res: Response) => {
    const employerId = req.query?.id;
    if (!employerId) throw new AppError({ statusCode: 400, message: 'Id required' })
    await employerModel.findByIdAndDelete({ employerId })
    res.sendStatus(200)
})