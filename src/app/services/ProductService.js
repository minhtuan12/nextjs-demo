import {Product, PRODUCT_STATUS} from "@/app/models";
import moment from "moment";
import {ObjectId} from 'mongodb'

export async function getProducts({q, sort_by, sort_order, page, page_size}) {
    q = q ? {$regex: new RegExp(q, "i")} : null;
    page = page ? Number(page) : 1
    page_size = page_size ? Number(page_size) : 20
    sort_by = sort_by ? sort_by : 'created_at'
    sort_order = sort_order ? sort_order : 'desc'

    let result = (await Product.aggregate([
        {
            $match: {
                deleted_at: null,
                ...(q ? {name: q} : null),
            },
        },
        {$sort: {[sort_by]: sort_order === "asc" ? 1 : -1}},
        {
            $facet: {
                metadata: [{$count: "total"}],
                data: [
                    {$skip: (page - 1) * page_size},
                    {$limit: page_size},
                    {
                        $project: {
                            _id: 1,
                            name: 1,
                            description: 1,
                            category_ids: 1,
                            creator_id: 1,
                            condition: 1,
                            image: 1,
                            status: 1,
                            bought_at: 1,
                            created_at: 1,
                        },
                    },
                ],
            },
        },
        {
            $project: {
                total: {
                    $cond: {
                        if: {$gt: [{$size: "$metadata"}, 0]},
                        then: {$arrayElemAt: ["$metadata.total", 0]},
                        else: 0,
                    },
                },
                data: 1,
            },
        },
    ]))?.map(product => {
        if (product.image) {
            product.image = process.env.DOMAIN_SERVER + '/uploads/' + product.image
        }
        return product
    })

    return {
        total: result[0].total,
        page,
        page_size,
        products: result[0].data,
    };
}

export async function getProduct(product) {
    if (product.image) {
        product.image = process.env.DOMAIN_SERVER + '/uploads/' + product.image
    }
    return product
}

export async function createProduct(creator, product) {
    const newProduct = new Product({
        creator_id: new ObjectId(creator._id),
        name: product.name,
        description: product.description,
        category_ids: product.category_ids,
        condition: product.condition,
        image: product.image,
        bought_at: product.bought_at,
        status: PRODUCT_STATUS.PENDING,
    })
    await newProduct.save()
}

export async function updateProduct(product, updatedProduct) {
    const {name, description, condition, image, bought_at} = updatedProduct
    product.name = name
    product.description = description
    product.condition = condition
    if (image) {
        product.image = image
    }
    product.bought_at = bought_at
    product.category_ids = updatedProduct.category_ids

    await product.save()
    return product
}

export async function deleteProduct(product) {
    product.deleted_at = moment()
    await product.save()
}








