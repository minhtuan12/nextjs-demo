import {Router} from "express";
import * as categoryController from "@/app/controllers/CategoryController";

const router = Router()

router.get(
    '/',
    categoryController.readRoot
)

export default router