import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import AppError from "../util/appError";
import env from '../util/validateEnv';
import FormData from "form-data";
import axios from 'axios';
import fs from 'fs';

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

    // Extract the Cloudflare media URL from the response
    const result = response.data.result

    // delete the local image file
    fs.unlinkSync(imageFile.path);

    res.status(200).json({ result })
})