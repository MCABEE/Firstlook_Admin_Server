import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import institutionModel from "../models/institutions/institutionModel";

// add new Institution
export const addInstitution = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;
    const { country, college, location } = req.body;
    await institutionModel.create({
        country,
        name: college,
        type,
        location,
    })
    res.sendStatus(201)
})

// Get all institutions in a country
export const getInstitutions = catchAsync(async (req: Request, res: Response) => {
    const { type } = req.params;
    const country = req.query?.country;
    if (!country) throw new AppError({ statusCode: 400, message: 'Country name required' })
    const institutions = institutionModel.find({ type, country })
    res.status(200).json({ institutions })
})

// Delete a institution
export const deleteInstitution = catchAsync(async (req: Request, res: Response) => {
    const institutionId = req.query?.id;
    if (!institutionId) throw new AppError({ statusCode: 400, message: 'Id required!' })
    await institutionModel.findByIdAndDelete(institutionId)
    res.sendStatus(200)
})