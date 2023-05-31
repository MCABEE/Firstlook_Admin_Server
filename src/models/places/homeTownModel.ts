import { Document, model, Types, Schema } from "mongoose";

interface IHomeTown extends Document {
    district: Types.ObjectId;
    name: string;
}

const homeTownSchema = new Schema({
    district: { type: Types.ObjectId, ref: 'District', required: true },
    name: { type: String, required: true }
})

export default model<IHomeTown>('HomeTown', homeTownSchema)