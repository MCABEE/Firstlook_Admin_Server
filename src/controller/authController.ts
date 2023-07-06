import { Request, Response } from "express";
import catchAsync from "../util/catchAsync";
import adminModel from "../models/admin/adminModel";
// import tokenModel from "../models/tokens/tokenModel";
import AppError from "../util/appError";
import env from '../util/validateEnv';
import bcrypt from 'bcrypt';
import jwt from "jsonwebtoken";
// import ms from 'ms';
// import { adminJwtPayload } from "../types";

const dev = env.NODE_ENV === "development";

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
    if (!email || !password) throw new AppError({ statusCode: 400, message: 'Credentials required' })
    const admin = await adminModel.findOne({ email, isMaster })
    if (!admin) throw new AppError({ statusCode: 401, message: 'Invalid credentials' })
    const isValidPassword = await bcrypt.compare(password, admin.password)
    if (!isValidPassword) throw new AppError({ statusCode: 401, message: 'Invalid credentials' })

    // generate access token
    const accessToken = generateJWT(
        { adminId: admin._id, email: admin.email, isMaster: admin.isMaster },
        env.ACCESS_TOKEN_SECRET,
        env.ACCESS_TOKEN_LIFE
    )

    // generate refresh token
    // const refreshToken = generateJWT(
    //     { adminId: admin._id, email: admin.email, isMaster: admin.isMaster },
    //     env.REFRESH_TOKEN_SECRET,
    //     env.REFRESH_TOKEN_LIFE
    // );

    // save refresh token
    // await tokenModel.create({
    //     userId: admin._id,
    //     refreshToken,
    //     expirationTime: new Date(Date.now() + ms(env.REFRESH_TOKEN_LIFE)),
    // })

    // set refresh token as http only cookie
    // res.cookie("refreshToken", refreshToken,
    //     {
    //         httpOnly: true,
    //         secure: !dev,
    //         signed: true,
    //         expires: new Date(Date.now() + ms(env.REFRESH_TOKEN_LIFE)),
    //         sameSite: 'none'
    //     }
    // );

    return res.status(200).json({ accessToken })
})

// Refresh accessToken
// export const refreshAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

//     const { signedCookies } = req;
//     const { refreshToken } = signedCookies;
//     if (!refreshToken) return res.sendStatus(204)

//     const refreshTokenInDB = tokenModel.findOne({ refreshToken })
//     if (!refreshTokenInDB) {
//         await clearTokens(req, res)
//         throw new AppError({ statusCode: 401, message: 'Invalid refresh token' })
//     }

//     const decodedToken = jwt.verify(refreshToken, env.REFRESH_TOKEN_SECRET) as adminJwtPayload;
//     const adminId = decodedToken.adminId;
//     const admin = await adminModel.findById(adminId);

//     if (!admin) {
//         await clearTokens(req, res);
//         throw new AppError({ statusCode: 401, message: 'Invalid refresh token' })
//     }

//     // generate access token
//     const accessToken = generateJWT(
//         { adminId: admin._id, email: admin.email, isMaster: admin.isMaster },
//         env.ACCESS_TOKEN_SECRET,
//         env.ACCESS_TOKEN_LIFE
//     )

//     return res.status(200).json({ accessToken });
// });

// Clear token
// const clearTokens = async (req: Request, res: Response) => {
//     const { signedCookies = {} } = req;
//     const { refreshToken } = signedCookies;

//     //delete from db
//     await tokenModel.findOneAndDelete({ refreshToken });

//     res.clearCookie('refreshToken', {
//         httpOnly: true,
//         secure: !dev,
//         signed: true,
//     });
// }

// generateJwt
const generateJWT = (payload: object, secret: string, expirationTime: string) => {
    return jwt.sign(
        payload,
        secret,
        { expiresIn: expirationTime }
    );
}