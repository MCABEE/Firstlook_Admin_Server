import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import streamModel from "../models/academic/streamModel";
import courseModel from "../models/academic/courseModel";

// add new stream
export const addStream = catchAsync(async (req: Request, res: Response) => {
    const { stream } = req.body;
    await streamModel.create({
        name: stream,
    })
    res.sendStatus(201)
})

// get all streams
export const getStreams = catchAsync(async (req: Request, res: Response) => {
    const streams = await streamModel.find({})
    res.status(200).json({ streams })
})

// delete a stream
export const deleteStream = catchAsync(async (req: Request, res: Response) => {
    const streamId = req.query?.id
    await streamModel.findByIdAndDelete(streamId)
    res.sendStatus(200)
})

// add new course
export const addCourse = catchAsync(async (req: Request, res: Response) => {
    const { stream, course } = req.body;
    await courseModel.create({
        stream,
        name: course,
    })
    res.sendStatus(201)
})

// get all courses
export const getCourses = catchAsync(async (req: Request, res: Response) => {
    const courses = await courseModel.aggregate([
        {
            $group: { _id: '$stream', courses: { $push: { _id: '$_id', name: '$name' } } }
        },
        {
            $sort: { _id: 1 }
        }
    ])
    res.status(200).json({ courses })
})

// delete a course
export const deleteCourse = catchAsync(async (req: Request, res: Response) => {
    const courseId = req.query?.id;
    if (!courseId) throw new AppError({ statusCode: 400, message: 'Id required' })
})