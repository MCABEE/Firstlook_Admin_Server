import { Document, model, Types, Schema } from "mongoose";

interface IToken extends Document {
    userId: Types.ObjectId;
    refreshToken: string;
    expirationTime: Date;
}

const tokenSchema = new Schema({
    userId: { type: Types.ObjectId, ref: 'Admin', required: true },
    refreshToken: { type: String, required: true },
    expirationTime: { type: Date, required: true },
})

export default model<IToken>('Token', tokenSchema);