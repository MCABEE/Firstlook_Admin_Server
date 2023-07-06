import { Router } from "express";
import * as authController from '../controller/authController'
import { authMiddleware } from "../middleware/authMiddleware";

const router = Router()

router
    .route('/newAdmin')
    .post(authController.newAdmin)

router
    .route('/login')
    .post(authController.login)

router
    .route('/refresh')
    .post()

router
    .route('/logout')
    .post(authMiddleware)

export default router;