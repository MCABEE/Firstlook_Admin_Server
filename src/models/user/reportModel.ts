import { Schema, Types, model, Document } from 'mongoose';

interface IReport extends Document {
    reporterId: Types.ObjectId;
    reportedProfile: Types.ObjectId;
    reason: string;
    detailedMessage: string;
}

const reportSchema = new Schema({
    reporterId: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    reportedProfile: {
        type: Types.ObjectId,
        ref: 'User',
        required: true
    },
    reason: {
        type: String,
        required: true
    },
    detailedMessage: {
        type: String
    },
    // resolved: {
    //     type: Boolean,
    //     default: false
    // }
}, { timestamps: true });

export default model<IReport>('Report', reportSchema);
