import NodeCache from "node-cache";
import moment from "moment";
import jwt from "jsonwebtoken";
import { User } from "../models";
import { comparePassword, generatePassword, generateToken} from "@/utils";

export const tokenBlocklist = new NodeCache({ checkperiod: process.env.TIME_TO_CHECK_PERIOD });

export async function checkValidLogin({ username, password }) {
    const user = await User.findOne({
        username: username,
        deleted_at: null,
    });

    if (user) {
        const verified = comparePassword(password, user.password);
        if (verified) {
            return user;
        }
    }

    return false;
}

export function authToken(user_id) {
    const expire_in = process.env.JWT_EXPIRES_IN;
    const token = generateToken({ user_id }, expire_in);
    return {
        token,
        expire_in,
        auth_type: "Bearer Token",
    };
}

export async function register({ username, name, password, status, avatar }) {
    const user = new User({
        username,
        name,
        password: generatePassword(password),
        status,
        avatar,
    });
    return await user.save();
}

export function blockToken(token) {
    const decoded = jwt.decode(token);
    const expiresIn = decoded.exp;
    const now = moment().unix();
    tokenBlocklist.set(token, 1, expiresIn - now);
}

export async function profile(user_id) {
    const user = await User.findOne({ _id: user_id }, { password: 0 });
    if (!user.avatar?.startsWith("https://")) {
        user.avatar = process.env.DOMAIN_SERVER + "/uploads/" + user.avatar;
    }
    return user;
}

export async function update(currentUser, { name, username, status, avatar }) {
    currentUser.name = name;
    currentUser.username = username;
    currentUser.status = status;
    if (avatar) {
        currentUser.avatar = avatar;
    }
    return await currentUser.save();
}
