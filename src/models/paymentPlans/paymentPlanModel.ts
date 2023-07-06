import { Document, model, Schema } from "mongoose";

interface IPaymentPlan extends Document {
    planName: string;
    actualAmount: number;
    offerAmount: number;
    gst: number;
    processingFee: number;
    total: number;
}

const paymentPlanSchema = new Schema({
    planName: { type: String, required: true },
    actualAmount: { type: Number, required: true },
    offerAmount: { type: Number, required: true },
    gst: { type: Number, required: true },
    processingFee: { type: Number, default: 0 },
    total: { type: Number, required: true }
})

export default model<IPaymentPlan>('PaymentPlan', paymentPlanSchema)