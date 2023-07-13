import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import postModel from "../models/user/postModel";
import env from '../util/validateEnv';
import axios from "axios";
import AppError from "../util/appError";
import { AuthenticatedRequest } from "../types";

// Verify user post
export const verifyPost = catchAsync(async (req: AuthenticatedRequest, res: Response) => {
    const postId = req.query.postId;
    if (!postId) throw new AppError({ statusCode: 400, message: 'Post id required' })
    await postModel.findByIdAndUpdate(postId,
        {
            $set: {
                'verification.verified': true,
                'verification.verifiedBy': req.decodedToken.adminId,
                'verification.verificationDate': Date.now()
            }
        })
    res.sendStatus(200)
})

// Get all non-verified image posts
export const getImages = catchAsync(async (req: Request, res: Response) => {
    const images = await postModel.find({ contentType: 'image', 'verification.verified': false })
        .skip(0)
        .limit(100)
        .populate({
            path: 'userId',
            model: 'User',
            select: { displayName: 1, firstName: 1, lastName: 1, profileImage: 1, 'personalInfo.religion': 1, 'personalInfo.caste': 1, native: 1, }
        })

    res.status(200).json({ posts: images })
})

// Get all non-verified video posts
export const getVideos = catchAsync(async (req: Request, res: Response) => {
    const videos = await postModel.find({ contentType: 'video', 'verification.verified': false }).limit(100).populate({
        path: 'userId',
        model: 'Post',
        select: { displayName: 1, firstName: 1, lastName: 1, 'personalInfo.religion': 1, 'personalInfo.caste': 1, native: 1, }
    })

    res.status(200).json({ posts: videos })
})

// Remove Image posts form DB and Cloudflare
export const removePost = catchAsync(async (req: Request, res: Response) => {
    const postId = req.query?.postId;
    const post = await postModel.findByIdAndDelete(postId);
    if (!post) { throw new AppError({ statusCode: 404, message: 'Post not found' }) }
    // const imageId = post.content.url;
    // await deleteImagePost(imageId);
    res.sendStatus(200);
})

// Remove Video posts from DB and Cloudflare
export const removeVideo = catchAsync(async (req: Request, res: Response) => {
    const postId = req.query?.postId;
    const post = await postModel.findByIdAndDelete(postId);
    if (!post) { throw new AppError({ statusCode: 404, message: 'Post not found' }) }
    const videoId = post.content.url;
    await deleteVideoPost(videoId);
    res.sendStatus(200);
})

// delete image from cloudflare
const deleteImagePost = async (imageId: string) => {
    const options = {
        method: 'DELETE',
        url: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/images/v1/${imageId}`,
        headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`
        },
    };

    await axios.request(options)
}

// delete video from cloudflare
const deleteVideoPost = async (videoId: string) => {
    const options = {
        method: 'DELETE',
        url: `https://api.cloudflare.com/client/v4/accounts/${env.CLOUDFLARE_ACCOUNT_ID}/stream/${videoId}`,
        headers: {
            'Authorization': `Bearer ${process.env.CLOUDFLARE_API_KEY}`
        },
    };

    await axios.request(options)
}
