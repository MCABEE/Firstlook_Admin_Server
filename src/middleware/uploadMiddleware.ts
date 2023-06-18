import multer, { Multer } from 'multer';
import { NextFunction, Request, Response } from 'express';

// Define the storage configuration for multer
const storage = multer.diskStorage({
    destination: (req: Request, file: Express.Multer.File, callback: (error: Error | null, destination: string) => void) => {
        // Specify the destination folder where the uploaded files should be stored
        callback(null, 'src/uploads/');
    },
    filename: (req: Request, file: Express.Multer.File, callback: (error: Error | null, filename: string) => void) => {
        callback(null, file.originalname);
    },
});

// Create the multer instance with the storage configuration
const upload: Multer = multer({ storage });

export default function (req: Request, res: Response, next: NextFunction) {
    upload.single('image')(req, res, (error: any) => {
        if (error) {
            console.error('Error uploading image:', error);
            return res.status(500).json({ error: 'Image upload failed' });
        }

        next();
    });
};