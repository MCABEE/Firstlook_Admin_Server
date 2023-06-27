import { Document, Schema, model } from "mongoose";

interface IDesignation extends Document {
    category: string;
    name: string;
}

const designationSchema = new Schema({
    category: { type: String, required: true },
    name: { type: String, required: true },
})

export default model<IDesignation>('Designation', designationSchema)