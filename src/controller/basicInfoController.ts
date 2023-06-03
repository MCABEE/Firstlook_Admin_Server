import { Request, Response } from "express";
import languageModel from "../models/basic/languageModel";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";

// Add new Language
export const newLanguage = catchAsync(async (req: Request, res: Response) => {
    const { stateId, language } = req.body;
    await languageModel.findOneAndUpdate({ state: stateId },
        { $addToSet: { languages: language } },
        { upsert: true })
    res.sendStatus(201)
})

// Get Languages
export const getLanguages = catchAsync(async (req: Request, res: Response) => {
    const country = req.query?.country
    if (country) {
        const languages = await languageModel.find({}).populate({ path: 'state', match: { country }, select: 'name' }).sort({ state: 1 })
        const filteredLanguages = languages.filter((language) => language.state !== null);
        // const states = await stateModel.find({ country }, { _id: 1 })
        // const languages = await languageModel.find({ state: { $in: states } }).populate('state')
        res.status(200).json({ languages: filteredLanguages })
    } else {
        const languages = await languageModel.find({}).populate({ path: 'state', select: 'name' }).sort({ state: 1 })
        res.status(200).json({ languages })
    }

})

// Delete a language
export const deleteLanguage = catchAsync(async (req: Request, res: Response) => {
    const { languageId, language } = req.query;
    if (!languageId || !language) throw new AppError({ statusCode: 400, message: 'Invalid request' })
    await languageModel.findByIdAndUpdate(languageId, { $pull: { languages: language } })
    res.sendStatus(200)
})