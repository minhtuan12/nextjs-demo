import {responseSuccess} from "@/utils";
import * as categoryService from "@/app/services/CategoryService";

export async function readRoot(req, res) {
    return responseSuccess(res, await categoryService.getCategories(req.body), 201)
}