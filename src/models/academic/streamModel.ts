import { Document, model, Schema } from "mongoose";

interface IStream extends Document {
    name: string;
}

const streamSchema = new Schema({
    name: { type: String, required: true, unique: true }
})

export default model<IStream>('Stream', streamSchema)