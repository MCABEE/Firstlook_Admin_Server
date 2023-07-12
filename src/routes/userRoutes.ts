import { Router } from "express";
import * as usersController from '../controller/usersController';

const router = Router()

router
    .route('/allUsers/:page')
    .get(usersController.getUsers)

router
    .route('/:id')
    .get(usersController.getUser)

router
    .route('/newUsers')
    .get()

export default router;