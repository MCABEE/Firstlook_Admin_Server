import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import env from '../util/validateEnv';
import FormData from "form-data";
import axios from 'axios';
import fs from 'fs';
import adminPostModel from "../models/adminPost/adminPostModel";

// get posts
export const getPosts = catchAsync(async (req: Request, res: Response) => {
    const posts = await adminPostModel.find({}).sort({ createdAt: -1 })
    res.status(200).json({ posts })
})

// add post
export const uploadPost = catchAsync(async (req: Request, res: Response) => {

    const imageFile = req.file;
    if (!imageFile) throw new AppError({ statusCode: 400, message: 'Image upload failed' })

    // Read the image file as binary data
    const fileData = fs.readFileSync(imageFile.path);

    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', fileData, { filename: imageFile.originalname });

    const options = {
        method: 'POST',
        url: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1`,
        headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${env.CLOUDFLARE_API_KEY}`
        },
        data: formData
    };

    const response = await axios.request(options)

    // Extract the Cloudflare image URL from the response
    const imageUrl = response.data.result.variants[0]
    const imageId = response.data.result.id
    const { title, buttonName, landingPage, startDate, endDate, audience } = req.body

    await adminPostModel.create({
        image: { url: imageUrl, id: imageId },
        title, buttonName, landingPage, startDate, endDate, audience: JSON.parse(audience)
    })

    // delete the local image file
    fs.unlinkSync(imageFile.path);

    res.sendStatus(200)
})

// Upadate post
export const updatePost = catchAsync(async (req: Request, res: Response) => {
    const postId = req.query?.postId
    const postDetails = req.body

    if (!postId || !postDetails) {
        throw new AppError({ name: 'Bad Request', statusCode: 400, message: 'Non-sufficient input' })
    }
    await adminPostModel.findByIdAndUpdate(postId, { $set: postDetails })
    res.sendStatus(200)
})

// delete post
export const deletePost = catchAsync(async (req: Request, res: Response) => {

    const postId = req.query?.postId
    if (!postId) throw new AppError({ name: 'No ID', statusCode: 400, message: 'Post Id required.' })

    const post = await adminPostModel.findById(postId)
    if (!post) throw new AppError({ statusCode: 400, message: 'Invalid post id' })
    const imageId = post?.image.id

    const options = {
        method: 'DELETE',
        url: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
        headers: {
            'Authorization': `Bearer ${env.CLOUDFLARE_API_KEY}`
        },
    };

    // delete image from cloudflare
    await axios.request(options)
    // delete post from DB
    await adminPostModel.findByIdAndDelete(postId)

    res.sendStatus(200)
})

// video post tesing
export const videopost = catchAsync(async (req: Request, res: Response) => {

    const videoFile = req.file;
    if (!videoFile) throw new AppError({ statusCode: 400, message: 'video upload failed' })

    // Read the image file as binary data
    const fileData = fs.readFileSync(videoFile.path);

    // Create a new FormData object
    const formData = new FormData();
    formData.append('file', fileData, { filename: videoFile.originalname });

    const { data } = await axios.post(
        `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream`,
        formData,
        {
            headers:
                { 'Content-Type': 'multipart/form-data', 'Authorization': `Bearer ${env.CLOUDFLARE_STREAM_API_TOKEN}` }
        }
    )

    // delete the local image file
    fs.unlinkSync(videoFile.path);

    res.status(200).json({ data })
})