import { Document, model, Schema, Types } from "mongoose";

interface IState extends Document {
    country: string;
    name: string;
}

const stateSchema = new Schema({
    country: { type: String, required: true },
    name: { type: String, required: true }
})

export default model<IState>('State', stateSchema)