import { Document, Schema, model, Types } from 'mongoose'

interface IAadhar extends Document {
    userId: Types.ObjectId;
    aadharNumber: number;
    fullName: string;
    dob: Date;
    fatherName: string;
    address: string;
    images?: {
        sideOne: { url: string, id: string };
        sideTwo: { url: string, id: string };
    };
    verification: {
        verified: boolean;
        verifiedBy: Types.ObjectId;
        verificationDate: Date
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
    verification: {
        verified: {
            type: Boolean,
            default: false
        },
        verifiedBy: {
            type: Types.ObjectId,
            ref: 'Admin'
        },
        verificationDate: {
            type: Date
        },
    }
}, { timestamps: true })

export default model<IAadhar>('Aadhar', aadharSchema)