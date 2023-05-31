import { Document, Schema, Types, model } from "mongoose";

interface IPincode extends Document {
    district: Types.ObjectId;
    code: number;
    postOffice: string;
}

const pincodeSchema = new Schema({
    district: { type: Types.ObjectId, ref:'State', required: true },
    code: { type: Number, required: true, unique: true },
    postOffice: { type: String, required: true, unique: true }
})

export default model<IPincode>('Pincode', pincodeSchema)