import { NextFunction, Request, Response } from 'express';
import fs from 'fs'
import multer from 'multer';
import AppError from '../util/appError';

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        if (!fs.existsSync("src/uploads")) {
            fs.mkdirSync("src/uploads");
        }

        if (!fs.existsSync("src/uploads/videos")) {
            fs.mkdirSync("src/uploads/videos");
        }

        cb(null, "src/uploads/videos");
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + file.originalname);
    },
});

const upload = multer({
    storage: storage,
});

export default function (req: Request, res: Response, next: NextFunction) {
    upload.single('video')(req, res, (error: any) => {
        if (error) {
            console.error('Error uploading video:', error);
            throw new AppError({ name: 'Multer error', statusCode: 500, message: 'video upload failed' })
        }

        next();
    });
}