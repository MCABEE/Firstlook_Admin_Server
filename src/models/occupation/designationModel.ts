import { Document, Schema, model } from "mongoose";

interface IDesigantion extends Document {
    stream: string,
    name: string
}

const designationSchema = new Schema({
    stream: { type: String, required: true },
    name: { type: String, required: true, unique: true }
})

export default model<IDesigantion>("Designation", designationSchema)