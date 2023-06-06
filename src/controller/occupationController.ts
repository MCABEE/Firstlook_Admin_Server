import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import occupationStreamModel from "../models/occupation/streamModel";
import designationModel from "../models/occupation/designationModel";

// Add new Stream
export const addStream = catchAsync(async (req: Request, res: Response) => {
    const { stream } = req.body;
    await occupationStreamModel.create({
        name: stream,
    })
    res.sendStatus(201)
})

// Get all streams
export const getStreams = catchAsync(async (req: Request, res: Response) => {
    const occupationStreams = await occupationStreamModel.find({})
    res.status(200).json({ occupationStreams })
})

// Delete a Stream
export const deleteStream = catchAsync(async (req: Request, res: Response) => {
    const streamId = req.query?.id;
    if (!streamId) throw new AppError({ statusCode: 400, message: 'Id required' })
    await occupationStreamModel.findByIdAndDelete(streamId);
    res.sendStatus(200)
})

// Add new Designation
export const addDesignation = catchAsync(async (req: Request, res: Response) => {
    const { stream, designation } = req.body;
    await designationModel.create({
        stream,
        name: designation,
    })
    res.sendStatus(200)
})

// Get all designations
export const getDesignations = catchAsync(async (req: Request, res: Response) => {
    // const stream = req.query?.stream;
    const designations = await designationModel.aggregate([
        {
            $group: { _id: '$stream', designations: { $push: { _id: '$_id', name: '$name' } } }
        },
        {
            $sort: { _id: 1 }
        }
    ])
    res.status(200).json({ designations })
})

// Delete a designation
export const deleteDesignation = catchAsync(async (req: Request, res: Response) => {
    const designationId = req.query?.id;
    if (!designationId) throw new AppError({ statusCode: 400, message: 'Id required' });
    await designationModel.findByIdAndDelete(designationId)
    res.sendStatus(200)
})