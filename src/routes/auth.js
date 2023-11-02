import {Router} from "express";
import {upload, validate, verifyToken} from "../app/middleware";
import * as authRequest from "../app/requests/AuthRequest";
import * as authController from "../app/controllers/AuthController";

const router = Router();

router.post(
    "/register",
    upload,
    validate(authRequest.register),
    authController.register
);
router.post(
    "/login",
    authController.login
);
router.post(
    "/logout",
    verifyToken,
    authController.logout
);
router.get(
    "/me",
    verifyToken,
    authController.me
);
router.put(
    "/me",
    verifyToken,
    upload,
    validate(authRequest.updateMe),
    authController.updateMe
);

export default router;
