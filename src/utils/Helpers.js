import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { SALT_ROUNDS } from "./Constants";

export function generatePassword(password) {
    const salt = bcrypt.genSaltSync(SALT_ROUNDS);
    return bcrypt.hashSync(password, salt);
}

export function comparePassword(password, passwordHash) {
    return bcrypt.compareSync(password, passwordHash);
}

export function generateToken(data, expiresIn, secretKey) {
    return jwt.sign(data, secretKey ? secretKey : process.env.SECRET_KEY, {
        ...(expiresIn ? { expiresIn } : {}),
    });
}

export function getToken(req) {
    const token = req.headers["authorization"];
    if (!token) return undefined;
    const match = token.match(/Bearer\s*(.+)/);
    return match ? match[1] : undefined;
}

export function escapeRegExp(input = "") {
    return input.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
