import { Router } from "express";
import * as postController from '../controller/postController';

const router = Router();

router
    .route('/verify')
    .patch(postController.verifyPost)

router
    .route('/images')
    .get(postController.getImages)
    .delete(postController.removePost)

router
    .route('/videos')
    .get()
    .delete()

export default router;