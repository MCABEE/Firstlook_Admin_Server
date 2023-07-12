import { Types } from "mongoose";
import jwt from "jsonwebtoken";
import { Request } from "express";


export interface adminJwtPayload extends jwt.JwtPayload {
    adminId: string;
    email: string;
    isMaster: boolean;
}

export interface AuthenticatedRequest extends Request {
    decodedToken: adminJwtPayload
}

interface UploadResponse {
    error: [object];
    messages: [object];
    result: { images: [object] };
    success: boolean;
}

export interface IUser {
    firstName: string;
    lastName: string;
    displayName: string;
    gender: string;
    phone: number;
    profileImage: string;
    dob: Date;
    personalInfo: {
        religion: string;
        caste: string;
        maritalStatus: string;
        height: number;
        weight: number;
        bodyType: string;
        physicalStatus: string;
        drinkingHabits: string;
        smokingHabits: string;
        foodHabits: string;
        bloodGroup: string;
        license: string;
        financialStatus: string;
    },
    occupation: {
        hasJob: string;
        country: string;
        state: string;
        district: string;
        city: string;
        annualIncome: string;
        designation: string;
        jobCategory: string;
        jobType: string;
        jobStream: string;
        department: string;
        companyName: string;
    },
    native: {
        district: string;
        state: string;
        country: string;
        motherTongue: string;
    },
    academic: {
        pursueAny: string;
        academicStream: string;
        courseName: string;
        country: string;
        university: string;
        college: string;
        institute: string;
        passOut: number;
    },
    family: {
        fatherName: string;
        fatherEducation: string;
        fatherOccupation: string;
        motherName: string;
        motherEducation: string;
        motherOccupation: string;
        siblings: number;
    },
    familyAddress: {
        houseName: string;
        homeTown: string;
        pincode: number;
        secondPhone: number;
        homePhone: number;
        diocese: string;
        allowedUsers: [Types.ObjectId]
    },
    preferenceData?: {
        age?: {
            minAge: number,
            maxAge: number,
        },
        height?: {
            minHeight: number,
            maxHeight: number,
        },
        caste?: [string];
        occupation?: [string];
        qualification?: [string];
        location?: [string];
        maritalStatus?: [string];
    },
    membershipType: string;
    membershipValidity: Date;
    connectionsCount: number;
    maxConnections: number;
    favourites: [Types.ObjectId];
    proposals: [Types.ObjectId];
    blockedProfiles: [Types.ObjectId];
    notInterested: [Types.ObjectId];
    profileViews: number;
    status: string;
    isVerified: boolean;
    registartionStatus: [string];
    createdAt: Date;
    updatedAt: Date;
}