import jwt from "jsonwebtoken";
import config from "../config";
import { Request } from "express";

interface TokenPayload {
	id: string;
	email: string;
}

const generateSignature = (payload: TokenPayload) => {
	try {
		return jwt.sign(payload, config.JWT_SECRET, { expiresIn: "1d" });
	} catch (error) {}
};

const validateSignature = (req: Request) => {
	try {
		const token = req.headers.authorization?.split(" ")[1];
		if (token) {
			const payload = jwt.verify(token, config.JWT_SECRET) as TokenPayload;
			req.user = payload;
			return true;
		}
		return false;
	} catch (error) {
		throw error;
	}
};

export { generateSignature, validateSignature, TokenPayload };
