import { Router } from "express";
import * as authController from '../controller/authController'

const router = Router()

router
    .route('/newAdmin')
    .post(authController.newAdmin)

router
    .route('/login')
    .post(authController.login)

router
    .route('/logout')
    .post()

export default router;