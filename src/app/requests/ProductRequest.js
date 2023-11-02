import Joi from "joi";
import {MAX_STRING_SIZE, PAGE_SIZE, responseError} from "@/utils";
import {isValidObjectId} from "mongoose";
import {Category, Product, PRODUCT_STATUS} from "@/app/models";
import {ObjectId} from "mongodb";

export const readRoot = {
    query: Joi.object({
        page: Joi.number().integer().min(1).label("Số trang").default(1),
        page_size: Joi.number().integer().min(1).max(100).label("Số sản phẩm mỗi trang").default(PAGE_SIZE),
        sort_by: Joi.valid("name").default('created_at'),
        sort_order: Joi.valid("asc", "desc").default("desc"),
    }).unknown(true),
}

export const createItem = {
    body: Joi.object({
        name: Joi.string().required().max(MAX_STRING_SIZE).label('Tên sản phẩm'),
        description: Joi.string().allow('').max(MAX_STRING_SIZE).label('Mô tả sản phẩm'),
        category_ids: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (isValidObjectId(value)) {
                    return async function () {
                        const category = await Category.findOne({_id: value, deleted_at: null})
                        if (!category) {
                            return helpers.message('Danh mục sản phẩm không tồn tại hoặc đã bị xóa')
                        }
                        return true
                    }
                }
                return helpers.error("any.invalid");
            })
        ).default([]).label('Danh mục sản phẩm'),
        condition: Joi.number().allow(null).label('Tình trạng sản phẩm'),
        image: Joi.object({
            originalname: Joi.string().trim().required().label("Tên ảnh sản phẩm"),
            mimetype: Joi.valid(
                "image/jpeg",
                "image/png",
                "image/svg+xml",
                "image/webp",
                "image/gif"
            )
                .required()
                .label("Định dạng ảnh sản phẩm"),
            buffer: Joi.any()
                .required()
                .custom((value, helpers) =>
                    Buffer.isBuffer(value) ? value : helpers.error("any.invalid")
                )
                .label("Dữ liệu của ảnh sản phẩm"),
        }).label('Ảnh sản phẩm'),
        bought_at: Joi.number().allow(null),
        status: Joi.number().valid(...Object.values(PRODUCT_STATUS)).default(PRODUCT_STATUS.PENDING),
    }).unknown(true)
}

export const updateItem = {
    body: Joi.object({
        name: Joi.string().required().max(MAX_STRING_SIZE).label('Tên sản phẩm'),
        description: Joi.string().allow('').max(MAX_STRING_SIZE).label('Mô tả sản phẩm'),
        category_ids: Joi.array().items(
            Joi.string().custom((value, helpers) => {
                if (isValidObjectId(value)) {
                    return async function () {
                        const category = await Category.findOne({_id: value, deleted_at: null})
                        if (!category) {
                            return helpers.message('Danh mục sản phẩm không tồn tại hoặc đã bị xóa')
                        }
                        return true
                    }
                }
                return helpers.error("any.invalid");
            })
        ).default([]).label('Danh mục sản phẩm'),
        condition: Joi.number().allow(null).label('Tình trạng sản phẩm'),
        image: Joi.object({
            originalname: Joi.string().trim().required().label("Tên ảnh sản phẩm"),
            mimetype: Joi.valid(
                "image/jpeg",
                "image/png",
                "image/svg+xml",
                "image/webp",
                "image/gif"
            )
                .required()
                .label("Định dạng ảnh sản phẩm"),
            buffer: Joi.any()
                .required()
                .custom((value, helpers) =>
                    Buffer.isBuffer(value) ? value : helpers.error("any.invalid")
                )
                .label("Dữ liệu của ảnh sản phẩm"),
        }).label('Ảnh sản phẩm'),
        bought_at: Joi.number().allow(null),
        status: Joi.number().valid(...Object.values(PRODUCT_STATUS)).default(PRODUCT_STATUS.PENDING),
    }).unknown(true)
}

export async function checkValidId(req, res, next) {
    if (!isValidObjectId(req.params.id)) {
        return responseError(res, 404, 'Sản phẩm không tồn tại, đã bị xóa hoặc đã được tiếp nhận')
    }

    const product = await Product.findOne({_id: req.params.id, deleted_at: null})
    if (!product) {
        return responseError(res, 404, 'Sản phẩm không tồn tại, đã bị xóa hoặc đã được tiếp nhận')
    }

    if (product.category_ids) {
        for (const category_id of product.category_ids) {
            const category = await Category.findOne({_id: category_id, deleted_at: null})
            if (!category) {
                return responseError(res, 404, 'Sản phẩm thuộc danh mục không được xác định')
            }
        }
    }

    req.product = product
    return next()
}