import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import employerModel from "../models/employer/employerModel";

// Add employer
export const addEmployer = catchAsync(async (req: Request, res: Response) => {
    const { category, employer } = req.body;
    await employerModel.create({
        category,
        name: employer,
    })
    res.sendStatus(201)
})

// Get employers
export const getEmployers = catchAsync(async (req: Request, res: Response) => {
    const category = req.query?.category || null;
    const employers = await employerModel.aggregate([
        {
            $match: {
                $expr: {
                    $cond: {
                        if: { $ne: [category, null] },
                        then: { $eq: ['$category', category] },
                        else: {}
                    }
                }
            }
        },
        {
            $group: { _id: '$category', employers: { $push: { _id: '$_id', name: '$name' } } }
        },
        {
            $sort: { '_id': 1 }
        }
    ])
    res.status(200).json({ employers })
})

// delete employer
export const deleteEmployer = catchAsync(async (req: Request, res: Response) => {
    const employerId = req.query?.id;
    if (!employerId) throw new AppError({ statusCode: 400, message: 'Id required' })
    await employerModel.findByIdAndDelete(employerId)
    res.sendStatus(200)
})