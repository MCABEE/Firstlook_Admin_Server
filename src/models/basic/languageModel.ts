import { Document, Types, model, Schema } from "mongoose";

interface ILangauage extends Document {
    state: Types.ObjectId
    language: string
}

const languageScema = new Schema({
    state: { type: Types.ObjectId, ref: 'State', required: true },
    language: { type: String, required: true },
})

export default model<ILangauage>('Language', languageScema)