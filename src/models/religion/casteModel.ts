import { Document, model, Schema, Types } from "mongoose";

interface ICaste extends Document {
    religion: Types.ObjectId,
    name: string
}

const casteSchema = new Schema({
    religion: { type: String, required: true, },
    name: { type: String, required: true, }
})

export default model<ICaste>('Caste', casteSchema)