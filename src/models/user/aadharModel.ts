import { Document, Schema, model, Types } from 'mongoose'

interface IAadhar extends Document {
    userId: Types.ObjectId;
    aadharNumber: number;
    fullName: string;
    dob: Date;
    fatherName: string;
    address: string;
    images: {
        sideOne: { url: string, id: string };
        sideTwo: { url: string, id: string };
    }
}

const aadharSchema = new Schema({
    userId: {
        type: Types.ObjectId,
        ref: 'User'
    },
    aadharNumber: {
        type: Number
    },
    fullName: {
        type: String
    },
    dob: {
        type: Date
    },
    fatherName: {
        type: String
    },
    address: {
        type: String
    },
    images: {
        sideOne: { url: String, id: String },
        sideTwo: { url: String, id: String },
    },
    isVerified: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })

export default model<IAadhar>('Aadhar', aadharSchema)