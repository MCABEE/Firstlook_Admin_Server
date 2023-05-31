import { Request, Response } from "express";
import languageModel from "../models/basic/languageModel";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";


// Add new Language
export const newLanguage = catchAsync(async (req: Request, res: Response) => {
    const { stateId, language } = req.body;
    await languageModel.create({
        state: stateId,
        language
    })
    res.sendStatus(201)
})

// Get all Languages
export const getLanguages = catchAsync(async (req: Request, res: Response) => {
    const languages = await languageModel.find({})
    res.status(200).json({ languages })
})

// Delete a language
export const deleteLanguage = catchAsync(async (req: Request, res: Response) => {
    const languageId = req.query?.id;
    if (!languageId) throw new AppError({ statusCode: 400, message: 'Invalid language id' })
    await languageModel.findByIdAndDelete(languageId)
    res.sendStatus(200)
})