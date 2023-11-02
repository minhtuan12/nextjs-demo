import Joi from "joi";
import {MAX_STRING_SIZE} from "@/utils";
import {AsyncValidate} from "../../utils/types";

import {User} from "../models";

export const login = {
    body: Joi.object({
        username: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Username"),
        password: Joi.string().max(MAX_STRING_SIZE).required().label("Mật khẩu"),
    }),
};

export const register = {
    body: Joi.object({
        name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
        username: Joi.string()
            .max(MAX_STRING_SIZE)
            .required()
            .label("Tài khoản")
            .custom(
                (value, helpers) =>
                    new AsyncValidate(value, async function () {
                        const user = await User.findOne({username: value});
                        return !user ? value : helpers.error("any.exists");
                    })
            ),
        password: Joi.string().min(6).max(MAX_STRING_SIZE).required().label("Mật khẩu"),
        avatar: Joi.object({
            originalname: Joi.string().trim().required().label("Tên ảnh"),
            mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
                .required()
                .label("Định dạng ảnh"),
            buffer: Joi.any()
                .required()
                .custom((value, helpers) => (Buffer.isBuffer(value) ? value : helpers.error("any.invalid")))
                .label("Dữ liệu của ảnh"),
        }).label("Ảnh đại diện"),
        status: Joi.number().required().valid(0, 1)
    }),
};

export const updateMe = {
    body: Joi.object({
        name: Joi.string().trim().max(MAX_STRING_SIZE).required().label("Họ và tên"),
        avatar: Joi.object({
            originalname: Joi.string().trim().required().label("Tên ảnh"),
            mimetype: Joi.valid("image/jpeg", "image/png", "image/svg+xml", "image/webp")
                .required()
                .label("Định dạng ảnh"),
            buffer: Joi.any()
                .required()
                .custom((value, helpers) => (Buffer.isBuffer(value) ? value : helpers.error("any.invalid")))
                .label("Dữ liệu của ảnh"),
        }).label("Ảnh đại diện"),
    }),
};