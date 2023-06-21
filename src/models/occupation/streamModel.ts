import { Document, Schema, model } from "mongoose";

interface IOccupationStream extends Document {
    category: string;
    name: string;
}

const OccupationStreamSchema = new Schema({
    category: { type: String, require: true },
    name: { type: String, required: true }
})

export default model<IOccupationStream>('OccupationStream', OccupationStreamSchema)