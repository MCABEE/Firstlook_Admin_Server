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
    const country = req.query?.country || null
    const languages = await languageModel.aggregate([
        {
            $lookup: {
                from: 'states',
                localField: 'state',
                foreignField: '_id',
                as: 'state'
            }
        },
        {
            $unwind: '$state'
        },
        {
            $match: {
                $expr: {
                    $cond: {
                        if: { $ne: [country, null] },
                        then: { $eq: ['$state.country', country] },
                        else: {}
                    }
                }
            }
        },
        {
            $group: { _id: '$state.country', states: { $push: { stateId: '$state._id', state: '$state.name', languages: '$languages' } } }
        }
    ])
    res.status(200).json({ languages })
})

// Delete a language
export const deleteLanguage = catchAsync(async (req: Request, res: Response) => {
    const { stateId, language } = req.query;
    if (!stateId || !language) throw new AppError({ statusCode: 400, message: 'Invalid request' })
    await languageModel.findOneAndUpdate({ state: stateId }, { $pull: { languages: language } })
    res.sendStatus(200)
})