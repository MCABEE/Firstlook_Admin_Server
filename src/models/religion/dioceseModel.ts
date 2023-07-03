import { Document, model, Schema, Types } from "mongoose";

interface IDiocese extends Document {
    caste: Types.ObjectId,
    name: string
}

const dioceseSchema = new Schema({
    caste: { type: String, required: true, },
    name: { type: String, required: true, }
})

export default model<IDiocese>('Diocese', dioceseSchema)