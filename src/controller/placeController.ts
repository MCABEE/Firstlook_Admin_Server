import { Request, Response, } from "express";
import catchAsync from "../util/catchAsync";
import countryModel from "../models/places/countryModel";
import stateModel from "../models/places/stateModel";
import districtModel from "../models/places/districtModel";
import homeTownModel from "../models/places/homeTownModel";
import pincodeModel from "../models/places/pincodeModel";
import cityModel from "../models/places/cityModel";
import AppError from "../util/appError";

// New Country
export const createCountry = catchAsync(async (req: Request, res: Response) => {
    const { country } = req.body;
    const newCounty = new countryModel({ name: country });
    await newCounty.save();
    res.sendStatus(201);
})

// Get all countries
export const getCountries = catchAsync(async (req: Request, res: Response) => {
    const countries = await countryModel.find({})
    res.status(200).json({ countries })
})

// delete a country
export const deleteCountry = catchAsync(async (req: Request, res: Response) => {
    const countryId = req.query?.id
    if (!countryId) throw new AppError({ statusCode: 400, message: 'ID of country not provided' });
    await countryModel.findByIdAndDelete(countryId)
    res.sendStatus(200)
})

// New State
export const createStates = catchAsync(async (req: Request, res: Response) => {
    const { country, state } = req.body;
    const newState = new stateModel({
        country,
        name: state,
    })
    await newState.save();
    res.sendStatus(201)
})

// Get all States
export const getStates = catchAsync(async (req: Request, res: Response) => {
    const states = await stateModel.find({})
    res.status(200).json({ states })
})

// Delete a state
export const deleteState = catchAsync(async (req: Request, res: Response) => {
    const stateId = req.query?.id;
    if (!stateId) throw new AppError({ statusCode: 400, message: 'ID of state not provided' })
    await stateModel.findByIdAndDelete(stateId)
    res.sendStatus(200)
})

// New District
export const createDistrict = catchAsync(async (req: Request, res: Response) => {
    const { stateId, district } = req.body;
    const newDistrict = new districtModel({
        state: stateId,
        name: district
    })
    await newDistrict.save()
    res.sendStatus(201)
})

// Get all district
export const getDistricts = catchAsync(async (req: Request, res: Response) => {
    const districts = await districtModel.find({}).populate('state')
    res.status(200).json({ districts })
})

// Delete a district
export const deleteDistrict = catchAsync(async (req: Request, res: Response) => {
    const districtId = req.query?.id
    if (!districtId) throw new AppError({ statusCode: 400, message: 'ID of district not provided' })
    await districtModel.findByIdAndDelete(districtId)
    res.sendStatus(200)
})

// new City
export const newCity = catchAsync(async (req: Request, res: Response) => {
    const { stateId, city } = req.body;
    const newCity = new cityModel({
        state:stateId,
        name: city
    })
    await newCity.save()
    res.sendStatus(201)
})

// Get all cities
export const getCities = catchAsync(async (req: Request, res: Response) => {
    const cities = await cityModel.find({})
    res.status(200).json({ cities })
})

// Delete a city
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
    const homeTowns = await homeTownModel.find({})
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
    const { district, pincode, postOffice } = req.body;
    const newPincode = new pincodeModel({
        district,
        code: pincode,
        postOffice,
    })
    await newPincode.save()
    res.sendStatus(201)
})

// Get all pincodes
export const getPincodes = catchAsync(async (req: Request, res: Response) => {
    const pincodes = await pincodeModel.find({})
    res.status(200).json({ pincodes })
})

// Delete a pincode
export const deletePincode = catchAsync(async (req: Request, res: Response) => {
    const pincodeId = req.query?.id
    if (!pincodeId) throw new AppError({ statusCode: 400, message: 'ID not provided' })
    await pincodeModel.findByIdAndDelete(pincodeId)
    res.sendStatus(200)
})