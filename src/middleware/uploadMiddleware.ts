import multer from 'multer';
import { NextFunction, Request, Response } from 'express';
import AppError from '../util/appError';
import fs from 'fs';

// Define the storage configuration for multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {

        if (!fs.existsSync("src/uploads")) {
            fs.mkdirSync("src/uploads");
        }

        // Specify the destination folder where the uploaded files should be stored
        callback(null, 'src/uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
        callback(null, file.originalname);
    },
});

// Create the multer instance
const upload = multer({ storage });

export default function (req: Request, res: Response, next: NextFunction) {
    upload.single('image')(req, res, (error: any) => {
        if (error) {
            console.error('Error uploading image:', error);
            throw new AppError({ name: 'Multer error', statusCode: 500, message: 'image upload failed' })
        }

        next();
    });
};