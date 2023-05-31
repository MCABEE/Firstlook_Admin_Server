import { Document, Types, model, Schema } from "mongoose";

enum institutionType {
    College = 'College',
    University = 'University',
    Institute = 'Institute'
}

interface IInstitution extends Document {
    country: string;
    name: string;
    type: institutionType;
    location: string;
}

const institutionSchema = new Schema({
    country: { type: String, required: true },
    name: { type: String, required: true },
    type: { type: String, enum: institutionType, required: true },
    location: { type: String, required: true },
})

export default model<IInstitution>('Institution', institutionSchema)