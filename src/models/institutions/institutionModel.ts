import { Document, Types, model, Schema } from "mongoose";

enum institutionType {
    college = 'college',
    university = 'university',
    institute = 'institute',
}

interface IInstitution extends Document {
    country: string;
    name: string;
    type: institutionType;
}

const institutionSchema = new Schema({
    country: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: institutionType, required: true },
})

export default model<IInstitution>('Institution', institutionSchema)