import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import adminModel from "../models/admin/adminModel";
import AppError from "../util/appError";
import env from '../util/validateEnv';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";

// create new admin -- test
export const newAdmin = catchAsync(async (req: Request, res: Response) => {
    const { email, password } = req.body;
    const isExist = await adminModel.findOne({ email })
    if (isExist) throw new AppError({ statusCode: 403, message: 'Email already exist' })
    const hashPassword = await bcrypt.hash(password, 10)
    await adminModel.create({
        email,
        password: hashPassword
    })
    res.sendStatus(201)
})

// Login verification
export const login = catchAsync(async (req: Request, res: Response) => {
    const { email, password, isMaster } = req.body;
    if(!email || !password ) throw new AppError({statusCode:400, message:'Credentials required'})
    const admin = await adminModel.findOne({ email, isMaster })
    if (!admin) throw new AppError({ statusCode: 401, message: 'Invalid credentials' })
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) throw new AppError({ statusCode: 401, message: 'Invalid credentials' })

    // generate token
    const token = jwt.sign({
        adminId: admin.id,
        email: admin.email,
        isMaster: admin.isMaster
    }, env.JWT_ACESS_SECRET, { expiresIn: '1d' })

    res.status(200).json({ token })
})