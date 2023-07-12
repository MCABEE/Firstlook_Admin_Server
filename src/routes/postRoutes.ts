import { Router } from "express";
import * as postController from '../controller/postController';

const router = Router();

router
    .route('/images')
    .get(postController.getImages)
    .patch(postController.verifyPost)
    .delete(postController.removePost)

router
    .route('/videos')
    .get()
    .patch()
    .delete()

export default router;