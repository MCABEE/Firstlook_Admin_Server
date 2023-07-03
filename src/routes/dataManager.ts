import { Router } from "express";
import * as placeController from '../controller/placeController';
import * as bacisInfoController from '../controller/basicInfoController';
import * as religionController from '../controller/religionController';
import * as institutionController from '../controller/institutionController';
import * as academicController from '../controller/academicController';
import * as occupationController from '../controller/occupationController';
import * as employerController from '../controller/employerController';
import * as adminPostController from '../controller/adminPostController';
import uploadMiddleware from "../middleware/uploadMiddleware";

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
    .route('/place/state/list')
    .get(placeController.getStatesList)

router
    .route('/place/district')
    .get(placeController.getDistricts)
    .post(placeController.createDistrict)
    .delete(placeController.deleteDistrict)

router
    .route('/place/district/list')
    .get(placeController.getDistrictsList)

router
    .route('/place/city')
    .get(placeController.getCities)
    .post(placeController.newCity)
    .delete(placeController.deleteCity)

router
    .route('/place/homeTown')
    .get(placeController.getHomeTowns)
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

router
    .route('/religion/caste/list')
    .get(religionController.getnCastesList)

router
    .route('/religion/diocese')
    .get(religionController.getDiocese)
    .post(religionController.addDiocese)
    .delete(religionController.deleteDiocese)

// ------------- INSTITUTION --------------
router
    .route('/institution/:type')
    .get(institutionController.getInstitutions)
    .post(institutionController.addInstitution)
    .delete(institutionController.deleteInstitution)

// ------------- ACADEMIC ----------------
router
    .route('/academic/stream')
    .get(academicController.getStreams)
    .post(academicController.addStream)
    .delete(academicController.deleteStream)

router
    .route('/academic/course')
    .get(academicController.getCourses)
    .post(academicController.addCourse)
    .delete(academicController.deleteCourse)

// ------------- OCCUPATION --------------- 
router
    .route('/occupation/stream')
    .get(occupationController.getStreams)
    .post(occupationController.addStream)
    .delete(occupationController.deleteStream)

router
    .route('/occupation/stream/list')
    .get(occupationController.getStreamsList)

router
    .route('/occupation/designation')
    .get(occupationController.getDesignations)
    .post(occupationController.addDesignation)
    .delete(occupationController.deleteDesignation)

// -------------- EMPLOYERS ---------------
router
    .route('/employer')
    .get(employerController.getEmployers)
    .post(employerController.addEmployer)
    .delete(employerController.deleteEmployer)

// ------------- ADMIN POST ---------------
router
    .route('/adminPost')
    .get(adminPostController.getPosts)
    .post(uploadMiddleware, adminPostController.uploadPost)
    .patch(adminPostController.updatePost)
    .delete(adminPostController.deletePost)

export default router;