import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import occupationStreamModel from "../models/occupation/streamModel";
import designationModel from "../models/occupation/designationModel";
import { Types } from "mongoose";

// Add new Stream
export const addStream = catchAsync(async (req: Request, res: Response) => {
    const { category, stream } = req.body;

    await occupationStreamModel.create({
        category,
        name: stream,
    })
    res.sendStatus(201)
})

// Get all streams
export const getStreams = catchAsync(async (req: Request, res: Response) => {
    const category = req.query?.category || null;
    const dropdown = req.query?.dropdown || false;

    if (dropdown) {
        const query = category ? { category } : {};
        const occupationStreams = await occupationStreamModel.find(query)
        return res.status(200).json({ occupationStreams })
    }

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

// Add new Designation
export const addDesignation = catchAsync(async (req: Request, res: Response) => {
    const { streamId, designation } = req.body;
    await designationModel.create({
        stream: streamId,
        name: designation,
    })
    res.sendStatus(200)
})

// Get all designations
export const getDesignations = catchAsync(async (req: Request, res: Response) => {
    const streamId = req.query?.streamId || null;
    const designations = await designationModel.aggregate([
        {
            $match: {
                $expr: {
                    $cond: {
                        if: { $ne: [streamId, null] },
                        then: { $eq: ['$stream', new Types.ObjectId(streamId as string)] },
                        else: {}
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'occupationstreams',
                localField: 'stream',
                foreignField: '_id',
                as: 'stream'
            }
        },
        {
            $unwind: '$stream'
        },
        {
            $group: {
                _id: { category: '$stream.category', stream: '$stream.name' },
                designations: { $push: { _id: '$_id', name: '$name' } }
            }
        },
        {
            $sort: { '_id.category': 1 }
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