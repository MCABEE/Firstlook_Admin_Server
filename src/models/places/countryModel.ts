import { Document, model, Schema, } from "mongoose";

interface Icountry extends Document {
    name: string;
}

const countrySchema = new Schema({
    name: { type: String, required: true, unique:true }
})

export default model<Icountry>('Country', countrySchema);