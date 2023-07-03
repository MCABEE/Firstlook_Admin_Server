import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import religionModel from "../models/religion/religionModel";
import casteModel from "../models/religion/casteModel";
import dioceseModel from "../models/religion/dioceseModel";

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
    const religions = await religionModel.find({}).sort({ name: 1 })
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

// get caste list
export const getnCastesList = catchAsync(async (req: Request, res: Response) => {
    const religion = req.query?.religion || null;
    const query = religion ? { religion } : {};
    const castes = await casteModel.find(query).sort({ name: 1 })
    res.status(200).json({ castes })
})

// Get all cast
export const getCast = catchAsync(async (req: Request, res: Response) => {
    const religion = req.query?.religion || null;

    const castes = await casteModel.aggregate([
        {
            $match: {
                $expr: {
                    $cond: {
                        if: { $ne: [religion, null] },
                        then: { $eq: ['$religion', religion] },
                        else: {}
                    }
                }
            }
        },
        {
            $group: { _id: '$religion', castes: { $push: { _id: '$_id', name: '$name' } } }
        },
        {
            $sort: { _id: 1 }
        }
    ])
    res.status(200).json({ castes })
})

// delete a caste
export const deleteCaste = catchAsync(async (req: Request, res: Response) => {
    const casteId = req.query?.id;
    if (!casteId) throw new AppError({ statusCode: 400, message: 'caste id required!' })
    await casteModel.findByIdAndDelete(casteId)
    res.sendStatus(200)
})

// add diocese
export const addDiocese = catchAsync(async (req: Request, res: Response) => {
    const { caste, diocese } = req.body;
    await dioceseModel.create({
        caste,
        name: diocese
    })
    res.sendStatus(201)
})

// get diocese
export const getDiocese = catchAsync(async (req: Request, res: Response) => {
    const caste = req.query?.caste || null;

    const dioceses = await dioceseModel.aggregate([
        {
            $match: {
                $expr: {
                    $cond: {
                        if: { $ne: [caste, null] },
                        then: { $eq: ['$caste', caste] },
                        else: {}
                    }
                }
            }
        },
        {
            $group: { _id: '$caste', dioceses: { $push: { _id: '$_id', name: '$name' } } }
        },
        {
            $sort: { _id: 1 }
        }
    ])
    res.status(200).json({ dioceses })
})

// delete diocese
export const deleteDiocese = catchAsync(async (req: Request, res: Response) => {
    const dioceseId = req.query?.id;
    if (!dioceseId) throw new AppError({ statusCode: 400, message: 'diocese id required!' })
    await dioceseModel.findByIdAndDelete(dioceseId)
    res.sendStatus(200)
})