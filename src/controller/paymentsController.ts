import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import paymentPlanModel from "../models/paymentPlans/paymentPlanModel";


// Get payment plans
export const getPaymentPlans = catchAsync(async (req: Request, res: Response) => {
    const paymentPlans = await paymentPlanModel.find({}).sort({ planName: 1 })
    res.status(200).json({ paymentPlans })
})

// Add payment plans
export const addPaymentPlan = catchAsync(async (req: Request, res: Response) => {
    const { planName, actualAmount, offerAmount, gst, processingFee, total } = req.body;

    await paymentPlanModel.create({
        planName,
        actualAmount,
        offerAmount,
        gst,
        processingFee,
        total,
    })

    res.sendStatus(201)
})

// Edit payment plan
export const editPaymentPlan = catchAsync(async (req: Request, res: Response) => {
    const planId = req.query?.id
    const { planName, actualAmount, offerAmount, gst, processingFee, total } = req.body;
    await paymentPlanModel.findByIdAndUpdate(planId,
        { $set: { planName, actualAmount, offerAmount, gst, processingFee, total } }
    )

    res.sendStatus(200)
})

export const deletePaymentPlan = catchAsync(async (req: Request, res: Response) => {
    const planId = req.query?.id
    await paymentPlanModel.findByIdAndDelete(planId)
    res.sendStatus(200)
})