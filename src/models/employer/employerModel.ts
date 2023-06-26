import { Document, Schema, model } from "mongoose";

interface IEmployer extends Document {
    country: string;
    name: string;
}

const employerSchema = new Schema({
    country: { type: String, required: true },
    name: { type: String, required: true }
})

export default model<IEmployer>("Employer", employerSchema);