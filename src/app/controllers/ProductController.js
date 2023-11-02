import {responseSuccess} from "@/utils";
import * as productService from '../services/ProductService'

export async function readRoot(req, res) {
    return responseSuccess(res, await productService.getProducts(req.body), 201)
}

export async function detail(req, res) {
    return responseSuccess(res, await productService.getProduct(req.product), 201)
}

export async function createItem(req, res) {
    if (req.body.image) {
        req.body.image = req.body.image.save('images')
    }
    await productService.createProduct(req.currentUser, req.body)
    return responseSuccess(res, null, 200)
}

export async function updateItem(req, res) {
    if (req.body.image) {
        req.body.image = req.body.image.save('images')
    }
    await productService.updateProduct(req.product, req.body)
    return responseSuccess(res, null, 200)
}

export async function deleteItem(req, res) {
    await productService.deleteProduct(req.product)
    return responseSuccess(res, null, 200)
}