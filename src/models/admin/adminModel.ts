import { Document, model, Schema } from "mongoose";

interface IAdmin extends Document {
    email: string;
    password: string;
    isMaster: boolean;
}

const adminSchema = new Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isMaster: { type: Boolean, default: false }
})

export default model<IAdmin>('Admin', adminSchema);