import {Schema, model} from "mongoose";

const categorySchema = new Schema(
    {
        name: {
            type: String,
            required: true
        },
        description: {
            type: String,
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

const Category = model("Category", categorySchema, "categories");

export default Category;
