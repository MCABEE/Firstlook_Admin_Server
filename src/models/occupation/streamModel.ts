import { Document, Schema, model } from "mongoose";

interface IOccupationStream extends Document {
    name: string;
}

const OccupationStreamSchema = new Schema({
    name: { type: String, required: true, unique: true }
})

export default model<IOccupationStream>('OccupationStream', OccupationStreamSchema)