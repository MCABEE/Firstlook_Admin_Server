import { Document, Types, model, Schema } from "mongoose";

interface ILangauage extends Document {
    state: Types.ObjectId;
    languages: string[];
}

const languageSchema = new Schema({
    state: { type: Types.ObjectId, ref: 'State', required: true },
    languages: { type: [String], required: true },
})

export default model<ILangauage>('Language', languageSchema)