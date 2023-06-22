import { Document, Schema, Date, model } from 'mongoose';

interface IAdminPost extends Document {
    imageUrl: string;
    imageId: string;
    title: string;
    buttonName: string;
    landingPage: string;
    startDate: Date;
    endDate: Date;
    audience?: object;
    createdAt: Date;
    updatedAt: Date;
}

const adminPostSchema = new Schema({
    imageUrl: { type: String, required: true },
    imageId: { type: String, required: true },
    title: { type: String, required: true },
    buttonName: { type: String },
    landingPage: { type: String },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    audience: { type: Object }
}, { timestamps: true })

export default model<IAdminPost>('AdminPost', adminPostSchema);