import { Document, Schema, model } from "mongoose";

interface IEmployer extends Document {
    category: string;
    name: string;
}

const employerSchema = new Schema({
    category: { type: String, required: true },
    name: { type: String, required: true }
})

export default model<IEmployer>("Employer", employerSchema);