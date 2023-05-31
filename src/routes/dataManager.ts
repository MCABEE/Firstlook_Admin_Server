import { Router } from "express";
import * as placeController from '../controller/placeController';
import * as bacisInfoController from '../controller/basicInfoController';
import * as religionController from '../controller/religionController';

const router = Router()

// ----------- PLACE --------------
router
    .route('/place/country')
    .get(placeController.getCountries)
    .post(placeController.createCountry)
    .delete(placeController.deleteCountry)

router
    .route('/place/state')
    .get(placeController.getStates)
    .post(placeController.createStates)
    .delete(placeController.deleteState)

router
    .route('/place/district')
    .get(placeController.getDistricts)
    .post(placeController.createDistrict)
    .delete(placeController.deleteDistrict)

router
    .route('/place/city')
    .get(placeController.getCities)
    .post(placeController.newCity)
    .delete(placeController.deleteCity)

router
    .route('/place/homeTown')
    .get(placeController.newHomeTown)
    .post(placeController.newHomeTown)
    .delete(placeController.deleteHomeTown)

router
    .route('/place/pincode')
    .get(placeController.getPincodes)
    .post(placeController.newPincode)
    .delete(placeController.deletePincode)


// ----------- BASIC INFO -------------
router
    .route('/basic/motherTounge')
    .get(bacisInfoController.getLanguages)
    .post(bacisInfoController.newLanguage)
    .delete(bacisInfoController.deleteLanguage)

// ----------- RELIGION --------------
router
    .route('/religion')
    .get(religionController.getReligions)
    .post(religionController.addReligion)
    .delete(religionController.deleteRiligion)

router
    .route('/religion/caste')
    .get(religionController.getCast)
    .post(religionController.addCast)
    .delete(religionController.deleteCaste)


export default router;