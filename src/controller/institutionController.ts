import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import institutionModel from "../models/institutions/institutionModel";

// add new Institution
export const addInstitution = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;
    const { country, institution, location } = req.body;
    await institutionModel.create({
        country,
        name: institution,
        type,
        location,
    })
    res.sendStatus(201)
})

// Get institutions in country wise
export const getInstitutions = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;
    const country = req.query?.country || null;
    const institutions = await institutionModel.aggregate([
        {
            $match: {
                type: type,
                $expr: {
                    $cond: {
                        if: { $ne: [country, null] },
                        then: { $eq: ['$country', country] },
                        else: {}
                    }
                }
            }
        },
        {
            $group: { _id: '$country', institutions: { $push: { _id: '$_id', name: '$name', location: '$location' } } }
        }
    ])
    res.status(200).json({ institutions })
})

// Delete a institution
export const deleteInstitution = catchAsync(async (req: Request, res: Response) => {
    const institutionId = req.query?.id;
    if (!institutionId) throw new AppError({ statusCode: 400, message: 'Id required!' })
    await institutionModel.findByIdAndDelete(institutionId)
    res.sendStatus(200)
})