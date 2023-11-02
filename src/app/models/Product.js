import {model, Schema} from "mongoose";
import {PRODUCT_STATUS} from "./Enum";

const ObjectId = Schema.Types.ObjectId;

const productSchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
            default: null
        },
        creator_id: {
            type: ObjectId,
            ref: 'User',
            required: true
        },
        category_ids: [
            {
                type: ObjectId,
                ref: 'Category'
            }
        ],
        condition: {
            type: Number,
            default: null
        },
        image: {
            type: String,
            default: null
        },
        status: {
            type: Number,
            required: true,
            enum: [...Object.values(PRODUCT_STATUS)],
            default: PRODUCT_STATUS.PENDING
        },
        bought_at: {
            type: Number,
            default: null
        },
        deleted_at: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: {createdAt: "created_at", updatedAt: "updated_at"},
    }
);

const Product = model("Product", productSchema, "products");

export default Product;
