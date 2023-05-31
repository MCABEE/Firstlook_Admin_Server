import { Document, Schema, Types, model } from "mongoose";

interface IDistrict extends Document {
    state: Types.ObjectId;
    name: string;
}

const districtSchema = new Schema({
    state: { type: Types.ObjectId, ref: 'State', required: true },
    name: { type: String, required: true }
})

export default model<IDistrict>('District', districtSchema)