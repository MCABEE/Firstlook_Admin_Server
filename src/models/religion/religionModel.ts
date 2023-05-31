import { Document, Schema, Types, model } from "mongoose";

interface IReligion extends Document {
    name: string
}

const religionSchema = new Schema({
    name: { type: String, required: true, unique: true }
})

export default model<IReligion>('Religion', religionSchema)