import { NextFunction, Request, Response, } from "express";
import catchAsync from "../util/catchAsync";
import countryModel from "../models/places/countryModel";
import stateModel from "../models/places/stateModel";
import districtModel from "../models/places/districtModel";
import homeTownModel from "../models/places/homeTownModel";
import pincodeModel from "../models/places/pincodeModel";
import cityModel from "../models/places/cityModel";
import AppError from "../util/appError";
import languageModel from "../models/basic/languageModel";
import { Types } from "mongoose";

// New Country
export const createCountry = catchAsync(async (req: Request, res: Response) => {
    const { country } = req.body;
    await countryModel.create({ name: country });
    res.sendStatus(201);
})

// Get all countries
export const getCountries = catchAsync(async (req: Request, res: Response) => {
    const countries = await countryModel.find({}).sort({ name: 1 })
    res.status(200).json({ countries })
})

// =========== delete a country ==============
export const deleteCountry = catchAsync(async (req: Request, res: Response) => {
    const countryId = req.query?.id
    if (!countryId) throw new AppError({ statusCode: 400, message: 'ID of country not provided' });
    await countryModel.findByIdAndDelete(countryId)
    res.sendStatus(200)
})

// =============== New State ================
export const createStates = catchAsync(async (req: Request, res: Response) => {
    const { country, state } = req.body;
    const newState = new stateModel({
        country,
        name: state,
    })
    await newState.save();
    res.sendStatus(201)
})

// ================== Get States ====================
export const getStates = catchAsync(async (req: Request, res: Response) => {
    const dropdown = req.query?.dropdown || false
    const country = req.query?.country || null

    if (dropdown) {
        const query = country ? { country } : {};
        const states = await stateModel.find(query).sort({ name: 1 })
        return res.status(200).json({ states })
    }

    const states = await stateModel.aggregate([
        {
            $match: {
                $expr: {
                    $cond: {
                        if: { $ne: [country, null] },
                        then: { $eq: ['$country', country] },
                        else: {}
                    }
                }
            }
        },
        {
            $group: { _id: '$country', states: { $push: { _id: '$_id', name: '$name' } } }
        },
        {
            $sort: { '_id.country': 1 }
        }
    ])
    res.status(200).json({ states })
})

//================ Delete a state ====================
export const deleteState = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const stateId = req.query?.id;
    if (!stateId) throw new AppError({ statusCode: 400, message: 'ID of state not provided' })

    const checkRelationWithDistricts = new Promise(async (resolve, reject) => {
        const districts = await districtModel.find({ state: stateId })
        if (districts.length) {
            reject(new AppError({
                statusCode: 400,
                name: 'Relation with other documents',
                message: 'Cannot delete, State has relation with districts'
            }))
        } else {
            return resolve('success')
        }
    })

    const checkRelationWithCities = new Promise(async (resolve, reject) => {
        const cities = await cityModel.find({ state: stateId })
        if (cities.length) {
            reject(new AppError({
                statusCode: 400,
                name: 'Relation with other documents',
                message: 'Cannot delete, State has relation with cities'
            }))
        } else {
            return resolve('success')
        }
    })

    const checkRelationWithLanguages = new Promise(async (resolve, reject) => {
        const languages = await languageModel.find({ state: stateId })
        if (languages.length) {
            reject(new AppError({
                statusCode: 400,
                name: 'Relation with other documents',
                message: 'Cannot delete, State has relation with mother tounge'
            }))
        } else {
            return resolve('success')
        }
    })

    Promise.all(
        [checkRelationWithDistricts, checkRelationWithCities, checkRelationWithLanguages]
    ).then(async () => {
        await stateModel.findByIdAndDelete(stateId)
        res.sendStatus(200)
    }).catch((error) => {
        next(error)
    })
})

// ============== New District ==================
export const createDistrict = catchAsync(async (req: Request, res: Response) => {
    const { stateId, district } = req.body;
    const newDistrict = new districtModel({
        state: stateId,
        name: district
    })
    await newDistrict.save()
    res.sendStatus(201)
})

//============== Get districts ==================
export const getDistricts = catchAsync(async (req: Request, res: Response) => {
    const dropdown = req.query?.dropdown || false
    const stateId = req.query?.stateId || null;

    if (dropdown) {
        const query = stateId ? { state: stateId } : {}
        const districts = await districtModel.find(query).sort({ name: 1 })
        return res.status(200).json({ districts })
    }

    const districts = await districtModel.aggregate([
        {
            $match: {
                $expr: {
                    $cond: {
                        if: { $ne: [stateId, null] },
                        then: { $eq: ['$state', new Types.ObjectId(stateId as string)] },
                        else: {}
                    }
                }
            }
        },
        {
            $lookup: {
                from: 'states',
                localField: 'state',
                foreignField: '_id',
                as: 'state'
            }
        },
        {
            $unwind: '$state'
        },
        {
            $group: {
                _id: { country: '$state.country', state: '$state.name' },
                districts: { $push: { _id: '$_id', name: '$name' } }
            }
        },
        {
            $sort: { '_id.state': 1 }
        }
    ])

    res.status(200).json({ districts })
})

// ============== Delete a district ================
export const deleteDistrict = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const districtId = req.query?.id as string
    if (!districtId) throw new AppError({ statusCode: 400, message: 'ID of district not provided' })

    const checkRelationWithHometowns = new Promise(async (resolve, reject) => {
        const homeTowns = await homeTownModel.find({ district: districtId })
        if (homeTowns.length) {
            return reject(new AppError({
                statusCode: 400,
                name: 'Relation with other documents',
                message: "couldn't delete, District has relation with Hometown"
            }))
        }
        resolve('success')
    })

    const checkRelationWithPicodes = new Promise(async (resolve, reject) => {
        const pincodes = await pincodeModel.find({ district: districtId })
        if (pincodes.length) {
            return reject(new AppError({
                statusCode: 400,
                name: 'Relation with other documents',
                message: "couldn't delete, District has relation with Pincode"
            }))
        }
        resolve('success')
    })

    Promise.all([checkRelationWithHometowns, checkRelationWithPicodes]).then(async (values) => {
        await districtModel.findOneAndDelete({ _id: new Types.ObjectId(districtId) })
        res.sendStatus(200)
    }).catch((error) => {
        next(error)
    })
})

// ================ new City =================
export const newCity = catchAsync(async (req: Request, res: Response) => {
    const { stateId, city } = req.body;
    const newCity = new cityModel({
        state: stateId,
        name: city
    })
    await newCity.save()
    res.sendStatus(201)
})

// ============ Get all cities ================
export const getCities = catchAsync(async (req: Request, res: Response) => {
    const cities = await cityModel.aggregate([
        {
            $lookup: {
                from: 'states',
                localField: 'state',
                foreignField: '_id',
                as: 'state'
            }
        },
        {
            $unwind: '$state'
        },
        {
            $group: {
                _id: { country: '$state.country', state: '$state.name' }, 
                cities: { $push: { _id: '$_id', name: '$name' } }
            }
        },
        {
            $sort: { '_id.state': 1 }
        }
    ])
    res.status(200).json({ cities })
})

// ============== Delete a city ================
export const deleteCity = catchAsync(async (req: Request, res: Response) => {
    const cityId = req.query?.id
    if (!cityId) throw new AppError({ statusCode: 400, message: 'ID of city not provided' })
    await cityModel.findByIdAndDelete(cityId)
    res.sendStatus(200)
})

// New Home Town
export const newHomeTown = catchAsync(async (req: Request, res: Response) => {
    const { district, homeTown } = req.body;
    const newHomeTown = new homeTownModel({
        district,
        name: homeTown
    })
    await newHomeTown.save()
    res.sendStatus(201)
})

// Get all Hometown
export const getHomeTowns = catchAsync(async (req: Request, res: Response) => {
    // const homeTowns = await homeTownModel.find({}).populate('district')
    const homeTowns = await homeTownModel.aggregate([
        {
            $lookup: {
                from: 'districts',
                localField: 'district',
                foreignField: '_id',
                as: 'district',
            }
        },
        {
            $unwind: '$district'
        },
        {
            $group: {
                _id: { state: '$district.state', district: '$district.name' },
                homeTowns: { $push: { _id: '$_id', name: '$name' } }
            }
        },
        {
            $sort: { '_id.district': 1 }
        }
    ])
    res.status(200).json({ homeTowns })
})

// Delete a Hometown
export const deleteHomeTown = catchAsync(async (req: Request, res: Response) => {
    const homeTownId = req.query?.id
    if (!homeTownId) throw new AppError({ statusCode: 400, message: 'ID of hometown not provided' })
    await homeTownModel.findByIdAndDelete(homeTownId);
    res.sendStatus(200)
})

// New Pincode
export const newPincode = catchAsync(async (req: Request, res: Response) => {
    const { districtId, pincode, postOffice } = req.body;
    const newPincode = new pincodeModel({
        district: districtId,
        code: pincode,
        postOffice,
    })
    await newPincode.save()
    res.sendStatus(201)
})

// Get all pincodes
export const getPincodes = catchAsync(async (req: Request, res: Response) => {
    const pincodes = await pincodeModel.aggregate([
        {
            $lookup: {
                from: 'districts',
                localField: 'district',
                foreignField: '_id',
                as: 'district',
            }
        },
        {
            $unwind: '$district'
        },
        {
            $group: {
                _id: { state: '$district.state', district: '$district.name' },
                pincodes: { $push: { _id: '$_id', code: '$code', postOffice: '$postOffice' } }
            }
        },
        {
            $sort: { '_id.district': 1 }
        }
    ])
    res.status(200).json({ pincodes })
})

// Delete a pincode
export const deletePincode = catchAsync(async (req: Request, res: Response) => {
    const pincodeId = req.query?.id
    if (!pincodeId) throw new AppError({ statusCode: 400, message: 'ID not provided' })
    await pincodeModel.findByIdAndDelete(pincodeId)
    res.sendStatus(200)
})