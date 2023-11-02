import {Router} from "express";
import * as productController from '../app/controllers/ProductController'
import {upload, validate, verifyToken} from "@/app/middleware";
import * as productRequest from "@/app/requests/ProductRequest";

const router = Router()

router.get(
    '/',
    validate(productRequest.readRoot),
    productController.readRoot
)

router.get(
    '/:id',
    productRequest.checkValidId,
    productController.detail
)

router.post(
    '/',
    verifyToken,
    upload,
    validate(productRequest.createItem),
    productController.createItem
)

router.put(
    '/:id',
    upload,
    productRequest.checkValidId,
    validate(productRequest.updateItem),
    productController.updateItem
)

router.delete(
    '/:id',
    productRequest.checkValidId,
    productController.deleteItem
)


export default router