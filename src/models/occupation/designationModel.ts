import { Document, Schema, model, Types } from "mongoose";

interface IDesigantion extends Document {
    stream: Types.ObjectId;
    name: string;
}

const designationSchema = new Schema({
    stream: { type: Types.ObjectId, ref:"OccupationStream", required: true },
    name: { type: String, required: true }
})

export default model<IDesigantion>("Designation", designationSchema)