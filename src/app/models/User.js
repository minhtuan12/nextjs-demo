import {Schema, model} from "mongoose";
import {USER_TYPE} from "./Enum";

const userSchema = new Schema(
    {
        username: {
            type: String,
            required: true,
            unique: true
        },
        name: {
            type: String,
            default: null
        },
        phone: {
            type: String,
            default: null
        },
        email: {
            type: String,
            email: true,
            trim: true,
            unique: true,
            default: null
        },
        avatar: {
            type: String,
            default: null,
        },
        password: {
            type: String,
            required: true,
        },
        type: {
            type: Number,
            required: true,
            enum: [...Object.values(USER_TYPE)],
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

const User = model("User", userSchema, "users");

export default User;
