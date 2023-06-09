import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import occupationStreamModel from "../models/occupation/streamModel";
import designationModel from "../models/occupation/designationModel";

// Add new Stream
export const addStream = catchAsync(async (req: Request, res: Response) => {
    const { category, stream } = req.body;

    await occupationStreamModel.create({
        category,
        name: stream,
    })
    res.sendStatus(201)
})

// Get streams list
export const getStreamsList = catchAsync(async (req: Request, res: Response) => {
    const category = req.query?.category || null;
    const query = category ? { category } : {};
    const occupationStreams = await occupationStreamModel.find(query)
    res.status(200).json({ occupationStreams })
})

// Get all streams
export const getStreams = catchAsync(async (req: Request, res: Response) => {
    const category = req.query?.category || null;

    const occupationStreams = await occupationStreamModel.aggregate([
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
            $group: { _id: '$category', streams: { $push: { _id: '$_id', name: '$name' } } }
        },
        {
            $sort: { _id: 1 }
        }
    ])
    res.status(200).json({ occupationStreams })
})

// Delete a Stream
export const deleteStream = catchAsync(async (req: Request, res: Response) => {
    const streamId = req.query?.id;
    if (!streamId) throw new AppError({ statusCode: 400, message: 'Id required' })
    await occupationStreamModel.findByIdAndDelete(streamId);
    res.sendStatus(200)
})

// Add new designation
export const addDesignation = catchAsync(async (req: Request, res: Response) => {
    const { category, designation } = req.body;
    await designationModel.create({ category, name: designation })
    res.sendStatus(200)
})

// Get designations
export const getDesignations = catchAsync(async (req: Request, res: Response) => {
    const category = req.query.category;
    const designations = await designationModel.find({ category }).sort({ name: 1 })
    res.status(200).json({ designations });
})

// Delete a designation
export const deleteDesignation = catchAsync(async (req: Request, res: Response) => {
    const designationId = req.query?.id;
    if (!designationId) throw new AppError({ statusCode: 400, message: 'ID required' });
    await designationModel.findByIdAndDelete(designationId);
    res.sendStatus(200);
})