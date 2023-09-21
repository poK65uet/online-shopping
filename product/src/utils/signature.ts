import jwt from "jsonwebtoken";
import config from "../config";
import { Request } from "express";
import { APIError, UnauthorizedError } from "./error";

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
		console.log(error);
		throw new UnauthorizedError("Not Authorized");
	}
};

export { generateSignature, validateSignature, TokenPayload };
