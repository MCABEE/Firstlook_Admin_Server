import { Document, Schema, model, Types } from "mongoose";

interface ICourse extends Document {
    stream: string;
    name: string;
}

const courseSchema = new Schema({
    stream: { type: String, required: true },
    name: { type: String, required: true }
})

export default model<ICourse>('Course', courseSchema)