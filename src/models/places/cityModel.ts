import { Document, Schema, Types, model } from "mongoose";

interface ICity extends Document {
    state: Types.ObjectId;
    name: String;
}

const citySchema = new Schema({
    state: { type: Types.ObjectId, ref:'State', required: true, },
    name: { type: String, required: true, }
})

export default model<ICity>('City', citySchema)