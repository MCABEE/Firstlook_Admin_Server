import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import occupationStreamModel from "../models/occupation/streamModel";

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