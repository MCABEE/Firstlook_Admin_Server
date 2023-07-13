import { Router } from "express";
import * as usersController from '../controller/usersController';

const router = Router()

router
    .route('/:id')
    .get(usersController.getUser)

router
    .route('/allUsers/:page')
    .get(usersController.getUsers)

router
    .route('/newUsers/:page')
    .get(usersController.getNewUsers)

router
    .route('/idVerification/:page')
    .get(usersController.idVerificationUsers)

router
    .route('/aadharDetails/:userId')
    .get(usersController.aadharDetails)


export default router;