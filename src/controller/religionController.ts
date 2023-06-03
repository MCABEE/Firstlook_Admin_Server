import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import religionModel from "../models/religion/religionModel";
import casteModel from "../models/religion/casteModel";

// Add new riligion
export const addReligion = catchAsync(async (req: Request, res: Response) => {
    const { religion } = req.body;
    await religionModel.create({
        name: religion
    })
    res.sendStatus(201)
})

// Get all riligions
export const getReligions = catchAsync(async (req: Request, res: Response) => {
    const religions = await religionModel.find({})
    res.status(200).json({ religions })
})

// Delete a riligion
export const deleteRiligion = catchAsync(async (req: Request, res: Response) => {
    const religionId = req.query?.id;
    if (!religionId) throw new AppError({ statusCode: 400, message: 'Invalid id' })
    await religionModel.findByIdAndDelete(religionId)
    res.sendStatus(200)
})

// Add new Cast
export const addCast = catchAsync(async (req: Request, res: Response) => {
    const { religion, caste } = req.body;
    await casteModel.create({
        religion,
        name: caste
    })
    res.sendStatus(201)
})

// Get all cast
export const getCast = catchAsync(async (req: Request, res: Response) => {
    const religion = req.query?.religion

    const query = religion ? [
        {
            $match: { religion: religion }
        },
        {
            $group: { _id: '$religion', castes: { $push: '$name' } }
        },
    ] : [
        {
            $group: { _id: '$religion', castes: { $push: '$name' } }
        }
    ];

    const castes = await casteModel.aggregate(query)
    res.status(200).json({ castes })
})

// delete a caste
export const deleteCaste = catchAsync(async (req: Request, res: Response) => {
    const caste = req.query?.caste;
    if (!caste) throw new AppError({ statusCode: 400, message: 'caste name required!' })
    await casteModel.findOneAndDelete({ name: caste })
    res.sendStatus(200)
})