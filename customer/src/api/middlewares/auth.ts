import { NextFunction, Request, Response } from "express";
import { validateSignature } from "../../utils";

export const authenticate = (
	req: Request,
	res: Response,
	next: NextFunction
) => {
	try {
		const isAuthorized = validateSignature(req);
		if (isAuthorized) {
			return next();
		}
		return res.status(403).json({ message: "Not Authorized" });
	} catch (error) {
		next(error);
	}
};
